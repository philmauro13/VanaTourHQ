window.TourHQ = window.TourHQ || {};

(function () {
  var config = window.TOURHQ_SUPABASE || null;
  var supabaseClient = null;
  var initPromise = null;

  function hasRemote() {
    return !!(config && config.url && config.anonKey);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-tourhq-supabase="true"]');
      if (existing) {
        if (window.supabase && window.supabase.createClient) {
          resolve();
        } else {
          existing.addEventListener('load', function () { resolve(); }, { once: true });
          existing.addEventListener('error', reject, { once: true });
        }
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.dataset.tourhqSupabase = 'true';
      script.onload = function () { resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function initSupabase() {
    if (!hasRemote()) return null;
    if (supabaseClient) return supabaseClient;
    if (!initPromise) {
      initPromise = loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2').then(function () {
        supabaseClient = window.supabase.createClient(config.url, config.anonKey);
        return supabaseClient;
      });
    }
    return initPromise;
  }

  async function getClient() {
    return initSupabase();
  }

  async function getSessionUser() {
    var client = await getClient();
    if (!client) return null;
    var result = await client.auth.getUser();
    return result && result.data ? result.data.user : null;
  }

  async function signUp(payload) {
    var client = await getClient();
    if (!client) {
      return { mode: 'local' };
    }

    var response = await client.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.name
        }
      }
    });

    if (response.error) throw response.error;

    var user = response.data && response.data.user ? response.data.user : null;
    if (user) {
      await ensureProfile(user, payload.name);
    }

    return { mode: 'remote', response: response };
  }

  async function signIn(payload) {
    var client = await getClient();
    if (!client) {
      return { mode: 'local' };
    }

    var response = await client.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    });

    if (response.error) throw response.error;
    return { mode: 'remote', response: response };
  }

  async function signOut() {
    var client = await getClient();
    if (!client) return;
    await client.auth.signOut();
  }

  async function ensureProfile(user, fullName) {
    var client = await getClient();
    if (!client || !user) return null;

    var usernameBase = (fullName || user.email || 'tourhq-user')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 24) || 'tourhq-user';

    var profile = {
      id: user.id,
      email: user.email,
      full_name: fullName || user.user_metadata && user.user_metadata.full_name || '',
      username: usernameBase,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    var existing = await client.from('profiles').select('id').eq('id', user.id).maybeSingle();
    if (existing.error && existing.error.code !== 'PGRST116') throw existing.error;

    if (!existing.data) {
      var insertResult = await client.from('profiles').insert(profile);
      if (insertResult.error && !String(insertResult.error.message || '').toLowerCase().includes('duplicate')) {
        throw insertResult.error;
      }
    }

    return profile;
  }

  async function createTour(tour) {
    var client = await getClient();
    if (!client) return { mode: 'local' };

    var user = await getSessionUser();
    if (!user) throw new Error('No authenticated user found.');

    var payload = {
      user_id: user.id,
      name: tour.name,
      artist_name: tour.artist,
      start_date: tour.startDate,
      end_date: tour.endDate,
      tm_name: tour.tmName || null,
      tm_email: tour.tmEmail || null,
      booking_agent: tour.bookingAgent || null,
      vehicle_type: tour.vehicleType || 'bus',
      drive_speed_mph: tour.driveSpeed || 55
    };

    var result = await client.from('tours').insert(payload).select('*').single();
    if (result.error) throw result.error;
    return { mode: 'remote', data: result.data };
  }

  async function listTours() {
    var client = await getClient();
    if (!client) return { mode: 'local', data: [] };

    var user = await getSessionUser();
    if (!user) return { mode: 'remote', data: [] };

    var result = await client
      .from('tours')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (result.error) throw result.error;
    return { mode: 'remote', data: result.data || [] };
  }

  // ---------- Document Storage ----------

  async function uploadDocument(file, tourId) {
    var client = await getClient();
    if (!client) return { mode: 'local' };

    var user = await getSessionUser();
    if (!user) throw new Error('No authenticated user found.');

    var bucket = 'tour-hq-docs';
    var filePath = user.id + '/' + Date.now() + '-' + file.name;

    var storageResult = await client.storage.from(bucket).upload(filePath, file);
    if (storageResult.error) throw storageResult.error;

    var metaResult = await client.from('documents').insert({
      user_id: user.id,
      tour_id: tourId || null,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      bucket: bucket
    }).select('*').single();

    if (metaResult.error) throw metaResult.error;
    return { mode: 'remote', data: metaResult.data };
  }

  async function listDocuments(tourId) {
    var client = await getClient();
    if (!client) return { mode: 'local', data: [] };

    var user = await getSessionUser();
    if (!user) return { mode: 'remote', data: [] };

    var query = client
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (tourId) query = query.eq('tour_id', tourId);

    var result = await query;
    if (result.error) throw result.error;
    return { mode: 'remote', data: result.data || [] };
  }

  async function deleteDocument(docId) {
    var client = await getClient();
    if (!client) return { mode: 'local' };

    var user = await getSessionUser();
    if (!user) throw new Error('No authenticated user found.');

    var doc = await client.from('documents').select('*').eq('id', docId).eq('user_id', user.id).maybeSingle();
    if (doc.error) throw doc.error;
    if (doc.data) {
      await client.storage.from(doc.data.bucket).remove([doc.data.file_path]);
      await client.from('documents').delete().eq('id', docId);
    }
    return { mode: 'remote' };
  }

  function getDocumentUrl(doc) {
    var client = window.TOURHQ_SUPABASE || null;
    if (!client) return '#';
    return client.url + '/storage/v1/object/public/' + (doc.bucket || 'tour-hq-docs') + '/' + doc.file_path;
  }

  window.TourHQ.supabase = {
    hasRemote: hasRemote,
    getClient: getClient,
    getSessionUser: getSessionUser,
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    ensureProfile: ensureProfile,
    createTour: createTour,
    listTours: listTours,
    uploadDocument: uploadDocument,
    listDocuments: listDocuments,
    deleteDocument: deleteDocument,
    getDocumentUrl: getDocumentUrl
  };
})();
