'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "07d801920e59796d1f201b7e64232090",
"assets/assets/images/banners.png": "8a57e922486ae1173fb637869608833b",
"assets/assets/images/category.png": "da67da8c47221c0822e8d16cb9cc12fe",
"assets/assets/images/containerBackground.png": "481a8c61cf8faeec7235c290ff78a90a",
"assets/assets/images/dashboardIcon.png": "b6e6fad9c7d51de71ef6065c586c99a2",
"assets/assets/images/disclaimer.png": "ade7b66f0835343867ac575013a39f62",
"assets/assets/images/events.png": "0af32c85f449b6ed9587e74216fbc48c",
"assets/assets/images/fighter.png": "6263c42f914ddf3beab8cfc60e862fdc",
"assets/assets/images/listMenuIcon.png": "28db937caae26c5a01b1d6570d0c9cb0",
"assets/assets/images/loading.gif": "8179f06dbe3ccb3a686c4b7f455bfdc3",
"assets/assets/images/loginBackground.png": "3b9205eee30a68db00621335c4612409",
"assets/assets/images/logout.png": "63b1a9eabead57e29792efa8d8ddab28",
"assets/assets/images/logo_empty.png": "cbcfa2f41d8e61fcdb273fb31f831caa",
"assets/assets/images/logo_fill.png": "fb1a96dceb8671fbf5bb7ededfa383da",
"assets/assets/images/logo_outlined.png": "9ce66825e8b507c45beeb4241da58ff1",
"assets/assets/images/more.png": "b6892236ab57cd92039aad54957e948d",
"assets/assets/images/notiIcon.png": "46752d6b50ea91bd8d48325da08761c7",
"assets/assets/images/polygon.png": "fabedd6314f94110f7a4cbe3bf518c50",
"assets/assets/images/privacyIcon.png": "8ad1d37ced69b696df69d2fc2bb1e2c4",
"assets/assets/images/role_icon2.png": "81aab582be4a8c92b75219219aa0a652",
"assets/assets/images/selectPicture.png": "b00b3ed4b8cbf7b7ac8bb73a03181578",
"assets/assets/images/subAdminIcon.png": "48fe6bd81df26be094d7d60cf1600062",
"assets/assets/images/termsIcon.png": "a03a5e8525079025a6a4c5a1b394b94a",
"assets/assets/images/text_logo.png": "7232cb22e20dc73f4d4378b2ee2c44a5",
"assets/assets/images/uploadImage.png": "ba6d161dee9e2253856e3bb217024b73",
"assets/assets/images/users.png": "f07141434374bfc6037de3a7df6e302e",
"assets/assets/translations/en.json": "b56abbc96f0dc1b491b3f1cd22d58874",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "18938dc3d93fce2ee3c0684889115627",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.ico": "e5527da2783632418418bd1905a69d14",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"icons/Icon-192.png": "38aa636858cc0d23244eb8fdb446efca",
"icons/Icon-512.png": "f649191e7330111c1dfbcf47f471d2ed",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "44845344969c13708ab79a502e3450ed",
"/": "44845344969c13708ab79a502e3450ed",
"main.dart.js": "9525cb3dea8bb632b78db6a3f2d7c346",
"manifest.json": "31e2d731f34e3389c3c25b0f73d8519a",
"version.json": "0e329fcdb1692905c4da736128a21f8f"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
