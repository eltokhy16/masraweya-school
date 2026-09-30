(function () {
  const cfg = window.MASRAWEYA_SUPABASE || {};
  const defaults = window.MASRAWEYA_DEFAULT_CONTENT || {};
  const lang = localStorage.getItem('masraweya-lang') || 'en';

  window.MASRAWEYA_CMS = {
    content: defaults,
    lang: lang,
    ready: false
  };

  /* =========================
     MERGE CMS DATA
  ========================== */

  function merge(a, b) {
    if (!b || typeof b !== 'object') {
      return a;
    }

    Object.keys(b).forEach(function (key) {

      if (
        b[key] &&
        typeof b[key] === 'object' &&
        !Array.isArray(b[key])
      ) {
        a[key] = merge(a[key] || {}, b[key]);
      } else {
        a[key] = b[key];
      }

    });

    return a;
  }


  /* =========================
     GET NESTED VALUE
  ========================== */

  function get(obj, path) {
    return path
      .split('.')
      .reduce(function (o, k) {
        return o == null ? undefined : o[k];
      }, obj);
  }


  /* =========================
     APPLY CMS CONTENT
  ========================== */

  function apply(content) {

    window.MASRAWEYA_CMS.content = content;

    document.documentElement.lang = lang;

    document.documentElement.dir =
      lang === 'ar' ? 'rtl' : 'ltr';


    /* =========================
       TEXT CONTENT
    ========================== */

    document
      .querySelectorAll('[data-cms]')
      .forEach(function (el) {

        const value = get(
          content,
          el.dataset.cms
        );

        if (value != null) {

          if (
            typeof value === 'object' &&
            !Array.isArray(value)
          ) {

            el.textContent =
              value[lang] ??
              value.en ??
              value.ar ??
              '';

          } else {

            el.textContent = value;
          }
        }
      });


    /* =========================
       CMS IMAGES
    ========================== */

    document
      .querySelectorAll('[data-cms-image]')
      .forEach(function (el) {

        const value = get(
          content,
          el.dataset.cmsImage
        );

        if (!value) {
          return;
        }

        /*
         * Remove responsive image sources
         * that could cause the browser to
         * display the old image.
         */

        el.removeAttribute('srcset');
        el.removeAttribute('sizes');


        /*
         * Set the CMS image.
         */

        el.src = value;


        /*
         * Mark image as CMS controlled.
         */

        el.dataset.cmsLoaded = 'true';

        el.dataset.cmsImageUrl = value;
      });


    /* =========================
       RESULTS LINK
    ========================== */

    document
      .querySelectorAll('[data-results-link]')
      .forEach(function (el) {

        const url =
          content.site?.resultsUrl || '#';

        el.href = url;

        el.target = '_blank';

        el.rel =
          'noopener noreferrer';
      });


    /* =========================
       SCHOOL NAME
    ========================== */

    document
      .querySelectorAll('[data-school-name]')
      .forEach(function (el) {

        const value =
          content.site?.name?.[lang];

        if (value) {
          el.textContent = value;
        }
      });


    /* =========================
       SCHOOL SUBTITLE
    ========================== */

    document
      .querySelectorAll('[data-school-sub]')
      .forEach(function (el) {

        const value =
          content.site?.sub?.[lang];

        if (value) {
          el.textContent = value;
        }
      });


    /* =========================
       CMS READY
    ========================== */

    window.MASRAWEYA_CMS.ready = true;

    window.dispatchEvent(
      new CustomEvent(
        'masraweya-cms-ready'
      )
    );
  }


  /* =========================
     WAIT FOR DOM
  ========================== */

  function applyWhenReady(content) {

    if (
      document.readyState ===
      'loading'
    ) {

      document.addEventListener(
        'DOMContentLoaded',
        function () {
          apply(content);
        },
        {
          once: true
        }
      );

    } else {

      apply(content);
    }
  }


  /* =========================
     LOAD FROM SUPABASE
  ========================== */

  async function load() {

    /*
     * Check configuration
     */

    if (
      !cfg.url ||
      !cfg.anonKey
    ) {

      console.warn(
        'Masraweya CMS: Supabase configuration missing.'
      );

      applyWhenReady(defaults);

      return;
    }


    try {

      /*
       * IMPORTANT:
       *
       * Do NOT add &_cms=...
       *
       * Do NOT add Authorization:
       * Bearer ...
       *
       * The Supabase Publishable Key
       * is sent through "apikey".
       */

      const endpoint =
        cfg.url +
        '/rest/v1/site_content?id=eq.1&select=content';


      /*
       * Request Supabase
       */

      const response =
        await fetch(
          endpoint,
          {
            method: 'GET',

            cache: 'no-store',

            headers: {
              'apikey': cfg.anonKey
            }
          }
        );


      /*
       * Check HTTP response
       */

      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          'Masraweya CMS Supabase error:',
          response.status,
          errorText
        );

        throw new Error(
          'Supabase HTTP ' +
          response.status
        );
      }


      /*
       * Read response
       */

      const rows =
        await response.json();


      console.log(
        'Masraweya CMS loaded:',
        rows
      );


      /*
       * Merge Supabase content
       * with default content.
       */

      const content =
        rows &&
        rows.length > 0 &&
        rows[0].content

          ? merge(
              structuredClone(defaults),
              rows[0].content
            )

          : defaults;


      /*
       * Apply CMS content
       */

      applyWhenReady(content);


    } catch (error) {

      console.error(
        'Masraweya CMS public load failed:',
        error
      );


      /*
       * Fallback to default content
       */

      applyWhenReady(defaults);
    }
  }


  /* =========================
     START
  ========================== */

  window.MASRAWEYA_CMS_READY =
    load();

})();
