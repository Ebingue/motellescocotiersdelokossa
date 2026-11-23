/* Les photos sont intégrées dans index.html (table window.IMGS) : aucun dossier images/ n'est nécessaire. */
/**
 * AUBERGE LES COCOTIERS DE LOKOSSA — APPLICATION JAVASCRIPT ES6+ (Édition Pro)
 */

(function () {
  const INITIAL_ROOMS = [
    {
      id: 'chambre-classique',
      title: 'Chambre Classique Élégance',
      category: 'Classique',
      price: 15000,
      area: '24 m²',
      bed: 'Lit Double Queen',
      capacity: '2 Personnes',
      badge: 'Propreté & Fraîcheur',
      image: IMGS['images/chambre-classique-elegance.jpg'],
      description: 'Chambre lumineuse à la propreté irréprochable avec salle de bain vitrée moderne, douche à l’italienne, climatisation silencieuse et draps en coton blanc supérieur.',
      amenities: ['Climatisation Split', 'Douche à l’italienne', 'Wi-Fi Gratuit', 'TV Écran Plat']
    },
    {
      id: 'chambre-executive',
      title: 'Chambre Exécutive Confort',
      category: 'Exécutive',
      price: 22000,
      area: '30 m²',
      bed: 'Lit Queen Size Premium',
      capacity: '2 Personnes',
      badge: 'Le Choix Affaires',
      image: IMGS['images/chambre-executive-confort.jpg'],
      description: 'Idéale pour vos séjours professionnels à Lokossa : espace bureau en bois massif, climatisation haute performance, éclairage tamisé et calme absolu à 2 pas de la Préfecture.',
      amenities: ['Bureau Exécutif', 'Climatisation Split', 'Linge Hôtelier 4*', 'Parking Sécurisé']
    },
    {
      id: 'suite-prestige',
      title: 'Suite Prestige Les Cocotiers',
      category: 'Suite',
      price: 30000,
      area: '42 m²',
      bed: 'Grand Lit King Size',
      capacity: '2 à 3 Personnes',
      badge: 'Standing VIP',
      image: IMGS['images/suite-prestige-cocotiers.jpg'],
      description: 'Notre suite signature offrant un vaste espace de repos, une tête de lit en teck, un coin fauteuil avec vue sur les cocotiers de la cour intérieure et un confort d’exception.',
      amenities: ['Lit King Size', 'Vue Cour & Cocotiers', 'Climatisation Silencieuse', 'Service Prioritaire']
    }
  ];

  const INITIAL_GALLERY = [
    {
      id: 'gal-1',
      title: 'Suite Prestige — Vue & Literie King Size',
      category: 'Chambres',
      image: IMGS['images/suite-prestige-cocotiers.jpg']
    },
    {
      id: 'gal-2',
      title: 'Chambre Exécutive — Espace Travail & Climatisation',
      category: 'Chambres',
      image: IMGS['images/chambre-executive-confort.jpg']
    },
    {
      id: 'gal-3',
      title: 'Chambre Classique & Salle de Bain Immaculée',
      category: 'Salle de bain',
      image: IMGS['images/chambre-classique-elegance.jpg']
    },
    {
      id: 'gal-4',
      title: 'Cour Intérieure Arborée — Les Cocotiers de Lokossa',
      category: 'Extérieur',
      image: IMGS['images/cour-exterieure-cocotiers.jpg']
    }
  ];

  const state = {
    rooms: INITIAL_ROOMS.slice(),
    gallery: INITIAL_GALLERY.slice(),
    activeRoomFilter: 'all',
    activeGalleryFilter: 'all',
    selectedRoomId: 'chambre-executive',
    nights: 2,
    guests: 2
  };

  let currentLightboxIndex = 0;

  try {
    const savedRooms = localStorage.getItem('cocotiers_lokossa_rooms_v1');
    const savedGallery = localStorage.getItem('cocotiers_lokossa_gallery_v1');
    if (savedRooms) {
      const parsed = JSON.parse(savedRooms);
      if (Array.isArray(parsed) && parsed.length > 0) state.rooms = parsed;
    }
    if (savedGallery) {
      const parsedG = JSON.parse(savedGallery);
      if (Array.isArray(parsedG) && parsedG.length > 0) state.gallery = parsedG;
    }
  } catch (e) {}

  function saveState() {
    try {
      localStorage.setItem('cocotiers_lokossa_rooms_v1', JSON.stringify(state.rooms));
      localStorage.setItem('cocotiers_lokossa_gallery_v1', JSON.stringify(state.gallery));
    } catch (e) {}
  }

  function formatFCFA(amount) {
    const num = Number(amount) || 0;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
  }

  function openModalSmooth(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    requestAnimationFrame(function () {
      modal.classList.add('modal-open');
    });
  }

  function closeModalSmooth(modal) {
    if (!modal || modal.classList.contains('hidden')) return;
    modal.classList.remove('modal-open');
    setTimeout(function () {
      modal.classList.add('hidden');
    }, 280);
  }

  function showToast(msg) {
    const toast = document.getElementById('toast-banner');
    const text = document.getElementById('toast-message');
    if (!toast || !text) return;
    text.textContent = msg;
    toast.classList.remove('hidden');
    requestAnimationFrame(function () {
      toast.classList.remove('toast-hidden');
      toast.classList.add('toast-visible');
    });
    if (window._toastTimer) clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function () {
      toast.classList.remove('toast-visible');
      toast.classList.add('toast-hidden');
      setTimeout(function () {
        toast.classList.add('hidden');
      }, 320);
    }, 4200);
  }

  function renderRooms() {
    const grid = document.getElementById('rooms-grid');
    const countAll = document.getElementById('count-all-rooms');
    if (countAll) countAll.textContent = String(state.rooms.length);
    if (!grid) return;

    const filtered = state.activeRoomFilter === 'all'
      ? state.rooms
      : state.rooms.filter(function (r) { return r.category === state.activeRoomFilter; });

    grid.innerHTML = filtered.map(function (room, idx) {
      const amenitiesHtml = (room.amenities || []).map(function (a) {
        return '<span class="px-2.5 py-1 bg-[#F5F3EE] text-[#1B2B34] text-[11px] font-medium border border-zinc-200/80">' + a + '</span>';
      }).join('');

      return (
        '<article style="animation-delay:' + (idx * 90) + 'ms" class="ert-cascade-item card-luxury bg-white overflow-hidden border border-zinc-200/90 flex flex-col justify-between shadow-sm">' +
          '<div>' +
            '<div class="relative h-64 overflow-hidden bg-[#1B2B34]">' +
              '<img src="' + room.image + '" alt="' + room.title + '" class="room-img-zoom w-full h-full object-cover" />' +
              '<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/15"></div>' +
              '<span class="absolute top-3.5 left-3.5 px-3 py-1 text-[10px] font-headline font-bold uppercase tracking-widest bg-[#CDA26B] text-white shadow-sm">' +
                (room.badge || room.category) +
              '</span>' +
              '<div class="absolute bottom-3.5 left-4 right-4 text-white">' +
                '<span class="text-[11px] uppercase tracking-wider text-[#E5CBA8] font-medium block">' + room.bed + ' • ' + room.area + '</span>' +
                '<h3 class="font-headline text-xl font-bold uppercase leading-tight mt-0.5">' + room.title + '</h3>' +
              '</div>' +
            '</div>' +
            '<div class="p-6 space-y-4">' +
              '<p class="text-xs sm:text-sm text-zinc-600 leading-relaxed">' + room.description + '</p>' +
              '<div class="flex flex-wrap gap-1.5">' + amenitiesHtml + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="px-6 pb-6 pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">' +
            '<div>' +
              '<span class="text-[10px] uppercase tracking-wider text-zinc-400 block">Tarif par nuit</span>' +
              '<span class="text-lg font-headline font-extrabold text-[#1B2B34]">' + formatFCFA(room.price) + '</span>' +
            '</div>' +
            '<div class="flex items-center gap-2">' +
              '<button type="button" class="btn-inspect-room p-2.5 border border-zinc-200 hover:bg-[#F5F3EE] text-[#1B2B34] transition-colors" data-room-id="' + room.id + '" title="Voir en grand">' +
                '<i data-lucide="maximize-2" class="w-4 h-4"></i>' +
              '</button>' +
              '<button type="button" class="btn-select-room btn-shimmer px-4 py-2.5 bg-[#CDA26B] hover:bg-[#B78B52] text-white text-xs font-headline font-bold uppercase tracking-wider transition-all" data-room-id="' + room.id + '">' +
                'Réserver' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    grid.querySelectorAll('.btn-inspect-room').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLightboxForRoom(btn.getAttribute('data-room-id'));
      });
    });

    grid.querySelectorAll('.btn-select-room').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectRoomForBooking(btn.getAttribute('data-room-id'), true);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function renderGallery() {
    const gGrid = document.getElementById('gallery-grid');
    if (!gGrid) return;

    const items = state.activeGalleryFilter === 'all'
      ? state.gallery
      : state.gallery.filter(function (g) { return g.category === state.activeGalleryFilter; });

    gGrid.innerHTML = items.map(function (item, idx) {
      return (
        '<div style="animation-delay:' + (idx * 75) + 'ms" class="ert-cascade-item group relative h-60 overflow-hidden bg-[#131F26] border border-white/10 cursor-pointer gallery-card-item" data-gal-id="' + item.id + '">' +
          '<img src="' + item.image + '" alt="' + item.title + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />' +
          '<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent flex flex-col justify-end p-4">' +
            '<span class="text-[10px] uppercase tracking-widest text-[#CDA26B] font-headline font-semibold">' + item.category + '</span>' +
            '<h4 class="text-sm font-headline font-bold text-white leading-snug">' + item.title + '</h4>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    gGrid.querySelectorAll('.gallery-card-item').forEach(function (card) {
      card.addEventListener('click', function () {
        const galId = card.getAttribute('data-gal-id');
        const idx = state.gallery.findIndex(function (x) { return x.id === galId; });
        if (idx !== -1) {
          currentLightboxIndex = idx;
          const found = state.gallery[idx];
          const lbCounter = document.getElementById('lightbox-counter');
          if (lbCounter) lbCounter.textContent = (idx + 1) + ' / ' + state.gallery.length;
          openLightboxCustom(found.image, found.title, found.category, 'Photographie officielle de l’Auberge Les Cocotiers de Lokossa (3ème von après la Préfecture à droite).');
        }
      });
    });
  }

  function renderBookingSelects() {
    const quickSelect = document.getElementById('quick-room-select');
    const bookSelect = document.getElementById('book-room');
    const optionsHtml = state.rooms.map(function (r) {
      const sel = r.id === state.selectedRoomId ? ' selected' : '';
      return '<option value="' + r.id + '"' + sel + '>' + r.title + ' — ' + formatFCFA(r.price) + '</option>';
    }).join('');

    if (quickSelect) quickSelect.innerHTML = optionsHtml;
    if (bookSelect) bookSelect.innerHTML = optionsHtml;
    updatePriceCalculations();
  }

  function renderStudioRoomList() {
    const listEl = document.getElementById('studio-room-list');
    if (!listEl) return;
    listEl.innerHTML = state.rooms.map(function (room) {
      return (
        '<div class="flex items-center justify-between gap-3 p-3 border border-zinc-200 bg-white">' +
          '<div class="flex items-center gap-3">' +
            '<img src="' + room.image + '" alt="' + room.title + '" class="w-14 h-14 object-cover border border-zinc-200 shrink-0" />' +
            '<div>' +
              '<div class="text-sm font-headline font-bold text-[#1B2B34]">' + room.title + '</div>' +
              '<div class="text-xs text-zinc-500">' + formatFCFA(room.price) + ' / nuit</div>' +
            '</div>' +
          '</div>' +
          '<label class="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#CDA26B] hover:bg-[#B78B52] text-white text-xs font-headline font-semibold uppercase tracking-wider shrink-0">' +
            '<i data-lucide="upload" class="w-3.5 h-3.5"></i>' +
            '<span>Choisir une photo</span>' +
            '<input type="file" accept="image/*" class="hidden studio-room-upload" data-room-id="' + room.id + '" />' +
          '</label>' +
        '</div>'
      );
    }).join('');

    listEl.querySelectorAll('.studio-room-upload').forEach(function (inp) {
      inp.addEventListener('change', function (e) {
        const rId = e.target.getAttribute('data-room-id');
        const f = e.target.files && e.target.files[0];
        if (rId && f) updateRoomPhoto(rId, f);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function updateRoomPhoto(roomId, file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      const dataUrl = evt.target.result;
      const target = state.rooms.find(function (r) { return r.id === roomId; });
      if (target) {
        target.image = dataUrl;
        state.gallery.unshift({
          id: 'gal-custom-' + Date.now(),
          title: target.title,
          category: 'Chambres',
          image: dataUrl
        });
        saveState();
        renderRooms();
        renderGallery();
        renderStudioRoomList();
        showToast('Photo mise à jour pour « ' + target.title + ' » !');
      }
    };
    reader.readAsDataURL(file);
  }

  function updatePriceCalculations() {
    const room = state.rooms.find(function (r) { return r.id === state.selectedRoomId; }) || state.rooms[0];
    const nights = Math.max(1, parseInt(state.nights, 10) || 1);
    const baseTotal = room.price * nights;

    const quickNightsLabel = document.getElementById('quick-nights-label');
    const quickTotalPrice = document.getElementById('quick-total-price');
    if (quickNightsLabel) quickNightsLabel.textContent = nights + (nights > 1 ? ' nuits' : ' nuit');
    if (quickTotalPrice) quickTotalPrice.textContent = formatFCFA(baseTotal);

    const optBreakfast = document.getElementById('opt-breakfast');
    const optLate = document.getElementById('opt-late');
    let optionsCost = 0;
    if (optBreakfast && optBreakfast.checked) optionsCost += 3000 * nights;
    if (optLate && optLate.checked) optionsCost += 5000;

    const grandTotal = baseTotal + optionsCost;
    const sName = document.getElementById('summary-room-name');
    const sRate = document.getElementById('summary-room-rate');
    const sNights = document.getElementById('summary-nights-count');
    const sGuests = document.getElementById('summary-guests-count');
    const sOpts = document.getElementById('summary-options-cost');
    const sGrand = document.getElementById('summary-grand-total');

    if (sName) sName.textContent = room.title;
    if (sRate) sRate.textContent = formatFCFA(room.price) + ' / nuit';
    if (sNights) sNights.textContent = nights + (nights > 1 ? ' nuitées' : ' nuitée');
    if (sGuests) sGuests.textContent = state.guests + (state.guests > 1 ? ' personnes' : ' personne');
    if (sOpts) sOpts.textContent = formatFCFA(optionsCost);
    if (sGrand) sGrand.textContent = formatFCFA(grandTotal);
  }

  function selectRoomForBooking(roomId, scrollToForm) {
    state.selectedRoomId = roomId;
    renderBookingSelects();
    if (scrollToForm) {
      const el = document.getElementById('reservation');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function openLightboxForRoom(roomId) {
    const room = state.rooms.find(function (r) { return r.id === roomId; });
    if (!room) return;
    const gIdx = state.gallery.findIndex(function (g) { return g.image === room.image; });
    if (gIdx !== -1) {
      currentLightboxIndex = gIdx;
      const lbCounter = document.getElementById('lightbox-counter');
      if (lbCounter) lbCounter.textContent = (gIdx + 1) + ' / ' + state.gallery.length;
    }
    openLightboxCustom(room.image, room.title, room.category + ' • ' + formatFCFA(room.price) + '/nuit', room.description, room.id);
  }

  function openLightboxCustom(imgSrc, title, category, desc, roomId) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const cat = document.getElementById('lightbox-cat');
    const tit = document.getElementById('lightbox-title');
    const dsc = document.getElementById('lightbox-desc');
    const bookBtn = document.getElementById('btn-lightbox-book');

    if (img) {
      if (modal && !modal.classList.contains('hidden') && img.getAttribute('src') !== imgSrc) {
        img.classList.add('img-swapping');
        setTimeout(function () {
          img.src = imgSrc;
          img.classList.remove('img-swapping');
        }, 160);
      } else {
        img.src = imgSrc;
      }
    }
    if (cat) cat.textContent = category;
    if (tit) tit.textContent = title;
    if (dsc) dsc.textContent = desc;
    if (bookBtn) {
      bookBtn.onclick = function () {
        closeModalSmooth(modal);
        if (roomId) selectRoomForBooking(roomId, true);
        else {
          const r = document.getElementById('reservation');
          if (r) r.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }
    openModalSmooth(modal);
  }

  function initDates() {
    const checkin = document.getElementById('book-checkin');
    const checkout = document.getElementById('book-checkout');
    const heroCheckin = document.getElementById('hero-checkin-input');
    const heroCheckout = document.getElementById('hero-checkout-input');

    const today = new Date();
    const d1 = new Date(today.getTime() + 86400000);
    const d2 = new Date(today.getTime() + 3 * 86400000);
    const fmt = function (d) { return d.toISOString().split('T')[0]; };
    const todayStr = fmt(today);

    [checkin, heroCheckin].forEach(function (el) {
      if (el) {
        el.min = todayStr;
        el.value = fmt(d1);
      }
    });
    [checkout, heroCheckout].forEach(function (el) {
      if (el) {
        el.min = fmt(d1);
        el.value = fmt(d2);
      }
    });

    function calcFromPair(inVal, outVal, outInputs) {
      if (!inVal || !outVal) return;
      const inDate = new Date(inVal);
      let outDate = new Date(outVal);
      if (outDate <= inDate) {
        outDate = new Date(inDate.getTime() + 86400000);
        const nextStr = fmt(outDate);
        outInputs.forEach(function (el) { if (el) el.value = nextStr; });
      }
      const diff = Math.round((outDate - inDate) / 86400000);
      if (diff > 0 && diff <= 60) {
        state.nights = diff;
        const qn = document.getElementById('quick-nights');
        if (qn) qn.value = String(diff);
        updatePriceCalculations();
      }
    }

    if (checkin) {
      checkin.addEventListener('change', function () {
        if (heroCheckin) heroCheckin.value = checkin.value;
        calcFromPair(checkin.value, checkout ? checkout.value : '', [checkout, heroCheckout]);
      });
    }
    if (checkout) {
      checkout.addEventListener('change', function () {
        if (heroCheckout) heroCheckout.value = checkout.value;
        calcFromPair(checkin ? checkin.value : '', checkout.value, [checkout, heroCheckout]);
      });
    }
    if (heroCheckin) {
      heroCheckin.addEventListener('change', function () {
        if (checkin) checkin.value = heroCheckin.value;
        calcFromPair(heroCheckin.value, heroCheckout ? heroCheckout.value : '', [checkout, heroCheckout]);
      });
    }
    if (heroCheckout) {
      heroCheckout.addEventListener('change', function () {
        if (checkout) checkout.value = heroCheckout.value;
        calcFromPair(heroCheckin ? heroCheckin.value : '', heroCheckout.value, [checkout, heroCheckout]);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDates();

    const RESTAURANT_ITEMS = [
      {
        id: 'dish-1',
        title: 'Petit-Déjeuner Complet des Cocotiers',
        category: 'Petit-Déjeuner',
        price: 3000,
        tag: 'Servi dès 06h30',
        desc: 'Café ou chocolat chaud, pain frais & viennoiseries, omelette aux fines herbes, fruits tropicaux de saison et jus naturel pressé.'
      },
      {
        id: 'dish-2',
        title: 'Poisson Braisé du Mono & Accompagnements',
        category: 'Plats & Grillades',
        price: 5500,
        tag: 'Spécialité Locale',
        desc: 'Poisson frais entier braisé aux épices douces, servi avec attiéké, alloco doré ou igname frite et sauce tomate maison.'
      },
      {
        id: 'dish-3',
        title: 'Poulet Bicyclette Braisé ou Kedjenou',
        category: 'Plats & Grillades',
        price: 6000,
        tag: 'Coup de Cœur',
        desc: 'Volaille locale tendre marinée et braisée au feu de bois ou mijotée aux légumes frais, accompagnée de riz parfumé.'
      },
      {
        id: 'dish-4',
        title: 'Filet de Bœuf Grillé & Frites Maison',
        category: 'Plats & Grillades',
        price: 6500,
        tag: 'Cuisine Continentale',
        desc: 'Pièce de bœuf tendre saisie à la demande, beurre maître d’hôtel, salade fraîche du jardin et pommes frites croustillantes.'
      },
      {
        id: 'dish-5',
        title: 'Jus Naturels & Cocktails Sans Alcool',
        category: 'Bar & Boissons',
        price: 1500,
        tag: '100% Naturel',
        desc: 'Jus d’ananas pain de sucre, bissap glacé à la menthe, baobab ou cocktail exotique fraîchement préparé au bar.'
      },
      {
        id: 'dish-6',
        title: 'Sélection Bar Lounge (Bières, Vins & Liqueurs)',
        category: 'Bar & Boissons',
        price: 2000,
        tag: 'Service Terrasse & Chambre',
        desc: 'Boissons glacées, eaux minérales, sucreries et sélection de vins servis en terrasse sous les cocotiers ou en chambre.'
      }
    ];

    let activeMenuFilter = 'all';

    function renderRestaurantMenu() {
      const mGrid = document.getElementById('restaurant-menu-grid');
      if (!mGrid) return;
      const list = activeMenuFilter === 'all'
        ? RESTAURANT_ITEMS
        : RESTAURANT_ITEMS.filter(function (d) { return d.category === activeMenuFilter; });

      mGrid.innerHTML = list.map(function (item, idx) {
        return (
          '<div style="animation-delay:' + (idx * 70) + 'ms" class="ert-cascade-item bg-white p-6 border border-zinc-200 flex flex-col justify-between gap-4 hover:border-[#CDA26B] transition-all shadow-sm">' +
            '<div>' +
              '<div class="flex items-start justify-between gap-3">' +
                '<div>' +
                  '<span class="text-[10px] font-headline font-bold uppercase tracking-widest text-[#CDA26B] block">' + item.category + ' • ' + item.tag + '</span>' +
                  '<h3 class="font-headline text-lg font-bold uppercase text-[#1B2B34] mt-0.5">' + item.title + '</h3>' +
                '</div>' +
                '<span class="font-headline font-extrabold text-base text-[#1B2B34] bg-[#F5F3EE] px-3 py-1 border border-zinc-200 shrink-0">' + formatFCFA(item.price) + '</span>' +
              '</div>' +
              '<p class="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">' + item.desc + '</p>' +
            '</div>' +
            '<div class="pt-3 border-t border-zinc-100 flex items-center justify-between">' +
              '<span class="text-[11px] text-zinc-400">Disponible en salle ou service en chambre</span>' +
              '<button type="button" class="btn-order-dish text-xs font-headline font-bold uppercase tracking-wider text-[#CDA26B] hover:text-[#1B2B34] transition-colors" data-dish-title="' + item.title + '">' +
                '+ Ajouter au séjour' +
              '</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');

      mGrid.querySelectorAll('.btn-order-dish').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const dishTitle = btn.getAttribute('data-dish-title');
          const notesEl = document.getElementById('book-notes');
          if (notesEl) {
            notesEl.value = (notesEl.value ? notesEl.value + ' | ' : '') + 'Commande Restaurant : ' + dishTitle;
          }
          if (dishTitle && dishTitle.indexOf('Petit-Déjeuner') !== -1) {
            const bf = document.getElementById('opt-breakfast');
            if (bf) bf.checked = true;
            updatePriceCalculations();
          }
          showToast('« ' + dishTitle + ' » ajouté aux notes de votre réservation !');
        });
      });
    }

    renderRestaurantMenu();

    document.querySelectorAll('.menu-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeMenuFilter = btn.getAttribute('data-mfilter') || 'all';
        document.querySelectorAll('.menu-filter-btn').forEach(function (b) {
          b.className = 'menu-filter-btn px-4 py-2 text-xs font-headline font-semibold uppercase tracking-wider bg-white text-[#1B2B34] border border-zinc-200 hover:bg-[#CDA26B] hover:text-white transition-all';
        });
        btn.className = 'menu-filter-btn px-4 py-2 text-xs font-headline font-bold uppercase tracking-wider bg-[#1B2B34] text-white transition-all';
        renderRestaurantMenu();
      });
    });

    document.querySelectorAll('.btn-apply-offer').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const rId = btn.getAttribute('data-offer-room') || 'chambre-executive';
        const n = parseInt(btn.getAttribute('data-offer-nights'), 10) || 2;
        const incBf = btn.getAttribute('data-offer-breakfast') === 'true';
        const oTitle = btn.getAttribute('data-offer-title') || '';

        state.selectedRoomId = rId;
        state.nights = n;
        const qn = document.getElementById('quick-nights');
        if (qn) qn.value = String(n);
        const bf = document.getElementById('opt-breakfast');
        if (bf) bf.checked = incBf;
        const notesEl = document.getElementById('book-notes');
        if (notesEl) notesEl.value = 'Offre sélectionnée : ' + oTitle;
        renderBookingSelects();
        const res = document.getElementById('reservation');
        if (res) res.scrollIntoView({ behavior: 'smooth' });
        showToast('Forfait « ' + oTitle + ' » appliqué à votre réservation !');
      });
    });

    renderRooms();
    renderGallery();
    renderBookingSelects();
    renderStudioRoomList();

    // Mobile menu
    const btnMobile = document.getElementById('btn-mobile-menu');
    const panelMobile = document.getElementById('mobile-menu-panel');
    if (btnMobile && panelMobile) {
      btnMobile.addEventListener('click', function () {
        const isHidden = panelMobile.classList.toggle('hidden');
        btnMobile.setAttribute('aria-expanded', String(!isHidden));
      });
      panelMobile.querySelectorAll('.mobile-nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          panelMobile.classList.add('hidden');
          btnMobile.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Guests synchronization between hero bar and booking form
    const guestsDisplay = document.getElementById('hero-guests-display');
    const quickGuests = document.getElementById('quick-guests');
    const bookGuests = document.getElementById('book-guests');
    const btnGuestsMinus = document.getElementById('btn-guests-minus');
    const btnGuestsPlus = document.getElementById('btn-guests-plus');

    function syncGuestsUI() {
      if (guestsDisplay) guestsDisplay.textContent = String(state.guests);
      if (quickGuests) quickGuests.value = String(state.guests);
      if (bookGuests) bookGuests.value = String(state.guests);
      updatePriceCalculations();
    }
    if (btnGuestsMinus) {
      btnGuestsMinus.addEventListener('click', function () {
        state.guests = Math.max(1, state.guests - 1);
        syncGuestsUI();
      });
    }
    if (btnGuestsPlus) {
      btnGuestsPlus.addEventListener('click', function () {
        state.guests = Math.min(4, state.guests + 1);
        syncGuestsUI();
      });
    }
    if (bookGuests) {
      bookGuests.addEventListener('change', function (e) {
        state.guests = parseInt(e.target.value, 10) || 2;
        syncGuestsUI();
      });
    }

    // Quick calculator controls
    const quickSelect = document.getElementById('quick-room-select');
    const bookSelect = document.getElementById('book-room');
    const quickNights = document.getElementById('quick-nights');
    const btnMinus = document.getElementById('btn-nights-minus');
    const btnPlus = document.getElementById('btn-nights-plus');
    const btnQuickGo = document.getElementById('btn-quick-book-go');

    if (quickSelect) {
      quickSelect.addEventListener('change', function (e) {
        state.selectedRoomId = e.target.value;
        if (bookSelect) bookSelect.value = state.selectedRoomId;
        updatePriceCalculations();
      });
    }
    if (bookSelect) {
      bookSelect.addEventListener('change', function (e) {
        state.selectedRoomId = e.target.value;
        if (quickSelect) quickSelect.value = state.selectedRoomId;
        updatePriceCalculations();
      });
    }
    if (quickNights) {
      quickNights.addEventListener('input', function (e) {
        state.nights = Math.max(1, parseInt(e.target.value, 10) || 1);
        updatePriceCalculations();
      });
    }
    if (btnMinus) {
      btnMinus.addEventListener('click', function () {
        state.nights = Math.max(1, state.nights - 1);
        if (quickNights) quickNights.value = String(state.nights);
        updatePriceCalculations();
      });
    }
    if (btnPlus) {
      btnPlus.addEventListener('click', function () {
        state.nights = Math.min(30, state.nights + 1);
        if (quickNights) quickNights.value = String(state.nights);
        updatePriceCalculations();
      });
    }
    if (btnQuickGo) {
      btnQuickGo.addEventListener('click', function () {
        const res = document.getElementById('reservation');
        if (res) res.scrollIntoView({ behavior: 'smooth' });
        showToast('Estimation : ' + ((document.getElementById('quick-total-price') || {}).textContent || '') + ' — Finalisez ci-dessous.');
      });
    }

    ['opt-breakfast', 'opt-late', 'opt-guide'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', updatePriceCalculations);
    });

    // Room Category Filter buttons
    document.querySelectorAll('.room-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.activeRoomFilter = btn.getAttribute('data-filter') || 'all';
        document.querySelectorAll('.room-filter-btn').forEach(function (b) {
          b.className = 'room-filter-btn px-4 py-2.5 text-xs font-headline font-semibold uppercase tracking-wider bg-white text-[#1B2B34] hover:bg-[#CDA26B] hover:text-white border border-zinc-200 transition-all';
        });
        btn.className = 'room-filter-btn px-4 py-2.5 text-xs font-headline font-bold uppercase tracking-wider bg-[#1B2B34] text-white shadow-sm transition-all';
        renderRooms();
      });
    });

    // Gallery Filter buttons
    document.querySelectorAll('.gallery-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.activeGalleryFilter = btn.getAttribute('data-gfilter') || 'all';
        document.querySelectorAll('.gallery-filter-btn').forEach(function (b) {
          b.className = 'gallery-filter-btn px-4 py-2.5 text-xs font-headline font-semibold uppercase tracking-wider bg-white/10 text-zinc-200 hover:bg-white/20 transition-all';
        });
        btn.className = 'gallery-filter-btn px-4 py-2.5 text-xs font-headline font-semibold uppercase tracking-wider bg-[#CDA26B] text-white transition-all';
        renderGallery();
      });
    });

    // Discreet Admin Photo Studio Modal
    const studioModal = document.getElementById('photo-studio-modal');
    const btnOpenStudio = document.getElementById('btn-open-photo-studio');
    const btnCloseStudio = document.getElementById('btn-close-studio');

    if (btnOpenStudio && studioModal) {
      btnOpenStudio.addEventListener('click', function () {
        renderStudioRoomList();
        openModalSmooth(studioModal);
      });
    }
    if (btnCloseStudio && studioModal) {
      btnCloseStudio.addEventListener('click', function () {
        closeModalSmooth(studioModal);
      });
      studioModal.addEventListener('click', function (e) {
        if (e.target === studioModal) closeModalSmooth(studioModal);
      });
    }

    const formAddRoom = document.getElementById('form-add-custom-room');
    if (formAddRoom) {
      formAddRoom.addEventListener('submit', function (e) {
        e.preventDefault();
        const titleEl = document.getElementById('new-room-title');
        const priceEl = document.getElementById('new-room-price');
        const catEl = document.getElementById('new-room-cat');
        const descEl = document.getElementById('new-room-desc');
        const photoEl = document.getElementById('new-room-photo');

        const file = photoEl && photoEl.files && photoEl.files[0];
        if (!file) {
          showToast('Veuillez sélectionner une photo pour la nouvelle chambre.');
          return;
        }

        const reader = new FileReader();
        reader.onload = function (evt) {
          const newRoom = {
            id: 'chambre-custom-' + Date.now(),
            title: (titleEl && titleEl.value) || 'Chambre Confort Cocotiers',
            category: (catEl && catEl.value) || 'Exécutive',
            price: parseInt(priceEl && priceEl.value, 10) || 20000,
            area: '28 m²',
            bed: 'Lit Double Grand Confort',
            capacity: '2 Personnes',
            badge: 'Nouvelle Chambre',
            image: evt.target.result,
            description: (descEl && descEl.value) || 'Chambre propre, climatisée et élégante.',
            amenities: ['Climatisation Split', 'Salle de bain privée', 'Wi-Fi Gratuit', 'Propreté Garantie']
          };
          state.rooms.unshift(newRoom);
          state.gallery.unshift({
            id: 'gal-room-' + Date.now(),
            title: newRoom.title,
            category: 'Chambres',
            image: evt.target.result
          });
          saveState();
          renderRooms();
          renderGallery();
          renderBookingSelects();
          renderStudioRoomList();
          formAddRoom.reset();
          if (studioModal) closeModalSmooth(studioModal);
          showToast('Nouvelle chambre « ' + newRoom.title + ' » ajoutée avec succès !');
        };
        reader.readAsDataURL(file);
      });
    }

    // Lightbox controls & backdrop click
    const lightboxModal = document.getElementById('lightbox-modal');
    const btnCloseLightbox = document.getElementById('btn-close-lightbox');
    if (btnCloseLightbox && lightboxModal) {
      btnCloseLightbox.addEventListener('click', function () {
        closeModalSmooth(lightboxModal);
      });
      lightboxModal.addEventListener('click', function (e) {
        if (e.target === lightboxModal) closeModalSmooth(lightboxModal);
      });
    }

    // Copy directions button
    const btnCopyDir = document.getElementById('btn-copy-directions');
    if (btnCopyDir) {
      btnCopyDir.addEventListener('click', function () {
        const textToCopy = "Auberge Les Cocotiers de Lokossa — Localisation : 3ème von après la Préfecture de Lokossa, à droite (Lokossa, Département du Mono, Bénin). Tél : (+229) 01 67 86 34 01.";
        copyTextSafe(textToCopy, 'Indication copiée dans le presse-papiers !');
      });
    }

    function copyTextSafe(str, successMsg) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(str).then(function () {
          showToast(successMsg);
        }).catch(function () {
          fallbackCopy(str, successMsg);
        });
      } else {
        fallbackCopy(str, successMsg);
      }
    }

    function fallbackCopy(str, successMsg) {
      const ta = document.createElement('textarea');
      ta.value = str;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      showToast(successMsg || 'Texte copié dans le presse-papiers !');
    }

    // Booking form submission with WhatsApp integration
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = (document.getElementById('book-name') || {}).value || 'Client';
        const phone = (document.getElementById('book-phone') || {}).value || '';
        const checkin = (document.getElementById('book-checkin') || {}).value || '';
        const checkout = (document.getElementById('book-checkout') || {}).value || '';
        const notes = (document.getElementById('book-notes') || {}).value || '';
        const room = state.rooms.find(function (r) { return r.id === state.selectedRoomId; }) || state.rooms[0];
        const totalText = (document.getElementById('summary-grand-total') || {}).textContent || '';
        const refCode = 'COC-' + Math.floor(100000 + Math.random() * 900000);

        const summary =
          'Réservation ' + refCode +
          ' | Client : ' + name + ' (' + phone + ')' +
          ' | Chambre : ' + room.title +
          ' | Voyageurs : ' + state.guests +
          ' | Du ' + checkin + ' au ' + checkout + ' (' + state.nights + ' nuit(s))' +
          ' | Total estimé : ' + totalText +
          (notes ? ' | Note : ' + notes : '');

        const box = document.getElementById('booking-confirmation-box');
        const refEl = document.getElementById('voucher-ref');
        const sumEl = document.getElementById('voucher-summary-text');
        const btnCopyVoucher = document.getElementById('btn-copy-voucher');
        const btnSendWa = document.getElementById('btn-send-whatsapp');

        if (refEl) refEl.textContent = refCode;
        if (sumEl) sumEl.textContent = summary;
        if (btnSendWa) {
          btnSendWa.href = 'https://wa.me/2290167863401?text=' + encodeURIComponent('Bonjour Auberge Les Cocotiers de Lokossa, voici ma demande de réservation : ' + summary);
        }
        if (box) box.classList.remove('hidden');
        if (btnCopyVoucher) {
          btnCopyVoucher.onclick = function () {
            copyTextSafe(summary, 'Récapitulatif copié dans le presse-papiers !');
          };
        }
        showToast('Bon de réservation ' + refCode + ' généré avec succès !');
      });
    }

    // Lightbox Prev / Next Navigation
    const btnLbPrev = document.getElementById('btn-lightbox-prev');
    const btnLbNext = document.getElementById('btn-lightbox-next');
    const lbCounter = document.getElementById('lightbox-counter');

    function showLightboxByIndex(idx) {
      if (!state.gallery.length) return;
      currentLightboxIndex = (idx + state.gallery.length) % state.gallery.length;
      const item = state.gallery[currentLightboxIndex];
      if (lbCounter) lbCounter.textContent = (currentLightboxIndex + 1) + ' / ' + state.gallery.length;
      openLightboxCustom(item.image, item.title, item.category, 'Photographie haute définition — Auberge Les Cocotiers de Lokossa (3ème von après la Préfecture à droite).');
    }

    if (btnLbPrev) {
      btnLbPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        showLightboxByIndex(currentLightboxIndex - 1);
      });
    }
    if (btnLbNext) {
      btnLbNext.addEventListener('click', function (e) {
        e.stopPropagation();
        showLightboxByIndex(currentLightboxIndex + 1);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (lightboxModal && !lightboxModal.classList.contains('hidden')) closeModalSmooth(lightboxModal);
        if (studioModal && !studioModal.classList.contains('hidden')) closeModalSmooth(studioModal);
      }
      if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') showLightboxByIndex(currentLightboxIndex - 1);
        if (e.key === 'ArrowRight') showLightboxByIndex(currentLightboxIndex + 1);
      }
    });

    // Interactive Testimonials Carousel
    const TESTIMONIALS = [
      {
        quote: 'Une propreté irréprochable et un calme rare à Lokossa. La chambre Exécutive était parfaitement climatisée pour ma mission à la Préfecture du Mono, située à peine à deux minutes.',
        author: 'Dr. Aristide K.',
        role: 'Consultant en mission • Cotonou',
        rating: '5.0 / 5'
      },
      {
        quote: 'Le cadre est vraiment classe et sécurisé dans la 3ème von après la Préfecture à droite. Literie digne d’un grand hôtel, salle de bain étincelante et accueil très respectueux.',
        author: 'Mme Clarisse H.',
        role: 'Séjour familial • Lokossa',
        rating: '5.0 / 5'
      },
      {
        quote: 'Le poisson braisé du restaurant La Table des Cocotiers et le petit-déjeuner servi dès 6h30 nous ont conquis. Une adresse incontournable dans le département du Mono.',
        author: 'M. Jean-Luc D.',
        role: 'Entrepreneur • Lomé & Bénin',
        rating: '4.9 / 5'
      },
      {
        quote: 'Parking intérieur fermé, Wi-Fi rapide pour travailler au calme et groupe électrogène disponible. Je recommande la Suite Prestige sans hésitation.',
        author: 'Ing. Sènakpon M.',
        role: 'Chef de projet • Porto-Novo',
        rating: '5.0 / 5'
      }
    ];

    let testiOffset = 0;

    function renderTestimonials() {
      const tContainer = document.getElementById('testimonials-slider');
      if (!tContainer) return;
      const visible = [];
      for (let i = 0; i < 3; i++) {
        visible.push(TESTIMONIALS[(testiOffset + i) % TESTIMONIALS.length]);
      }
      tContainer.innerHTML = visible.map(function (t, idx) {
        return (
          '<article style="animation-delay:' + (idx * 90) + 'ms" class="ert-cascade-item bg-[#1B2B34] p-7 border-t-2 border-[#CDA26B] flex flex-col justify-between shadow-lg transition-all duration-300">' +
            '<div>' +
              '<div class="flex items-center justify-between text-[#CDA26B] text-xs font-bold mb-4">' +
                '<span>★★★★★</span>' +
                '<span class="px-2 py-0.5 bg-[#CDA26B]/15 text-[#E5CBA8]">' + t.rating + '</span>' +
              '</div>' +
              '<p class="text-zinc-200 italic leading-relaxed text-sm">« ' + t.quote + ' »</p>' +
            '</div>' +
            '<div class="mt-6 pt-4 border-t border-white/10">' +
              '<div class="font-headline font-bold text-base text-white">' + t.author + '</div>' +
              '<div class="text-xs text-[#CDA26B] uppercase tracking-wider mt-0.5">' + t.role + '</div>' +
            '</div>' +
          '</article>'
        );
      }).join('');
    }

    renderTestimonials();

    const btnTestiPrev = document.getElementById('btn-testi-prev');
    const btnTestiNext = document.getElementById('btn-testi-next');
    if (btnTestiPrev) {
      btnTestiPrev.addEventListener('click', function () {
        testiOffset = (testiOffset - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
        renderTestimonials();
      });
    }
    if (btnTestiNext) {
      btnTestiNext.addEventListener('click', function () {
        testiOffset = (testiOffset + 1) % TESTIMONIALS.length;
        renderTestimonials();
      });
    }

    // Sticky Header Scroll Transition, Reading Progress Bar & ScrollSpy
    const mainHeader = document.getElementById('main-header');
    const progressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (mainHeader) {
        if (scrollTop > 36) mainHeader.classList.add('header-scrolled');
        else mainHeader.classList.remove('header-scrolled');
      }
      if (progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
        progressBar.style.width = pct.toFixed(1) + '%';
      }
    }, { passive: true });

    // Subtle transition veil on anchor navigation
    const navVeil = document.getElementById('nav-transition-veil');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (navVeil && !prefersReduced) {
      document.querySelectorAll('a.nav-top-link, a.mobile-nav-link').forEach(function (a) {
        a.addEventListener('click', function () {
          navVeil.classList.add('veil-active');
          setTimeout(function () {
            navVeil.classList.remove('veil-active');
          }, 260);
        });
      });
    }

    const navLinks = Array.from(document.querySelectorAll('a.nav-top-link'));
    const sections = navLinks.map(function (link) {
      const id = link.getAttribute('href');
      return id && id.startsWith('#') ? document.querySelector(id) : null;
    });

    if ('IntersectionObserver' in window) {
      const spyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const targetId = '#' + entry.target.id;
            navLinks.forEach(function (l) {
              if (l.getAttribute('href') === targetId) {
                l.classList.add('active-nav', 'text-[#CDA26B]');
                l.classList.remove('text-[#1B2B34]');
              } else {
                l.classList.remove('active-nav', 'text-[#CDA26B]');
                l.classList.add('text-[#1B2B34]');
              }
            });
          }
        });
      }, { rootMargin: '-35% 0px -55% 0px' });

      sections.forEach(function (sec) {
        if (sec) spyObserver.observe(sec);
      });
    }

    // Custom Floating Cursor for Gallery & Room Imagery (Desktop)
    const customCursor = document.getElementById('custom-gallery-cursor');
    if (customCursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.addEventListener('mousemove', function (e) {
        customCursor.style.transform = 'translate3d(' + (e.clientX - 32) + 'px, ' + (e.clientY - 32) + 'px, 0)';
        const hoverTarget = e.target && e.target.closest && e.target.closest('.gallery-card-item');
        customCursor.style.opacity = hoverTarget ? '1' : '0';
      }, { passive: true });
    }

    // GSAP Counters, Hero Entrance & Subtle Parallax
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
      window.gsap.from('#hero-main-title span', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.13,
        ease: 'power3.out',
        delay: 0.2
      });

      if (window.ScrollTrigger && window.matchMedia('(min-width: 1024px)').matches) {
        const heroBg = document.getElementById('hero-bg-image');
        if (heroBg) {
          window.gsap.to(heroBg, {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: '#accueil',
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      }

      document.querySelectorAll('.luxury-counter').forEach(function (counterEl) {
        const targetVal = parseInt(counterEl.getAttribute('data-target'), 10) || 0;
        const obj = { val: 0 };
        window.gsap.to(obj, {
          val: targetVal,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: counterEl, start: 'top 90%' },
          onUpdate: function () { counterEl.textContent = String(Math.round(obj.val)); }
        });
      });
    }

    // Element Reveal Transition (ERT) — Scroll Reveal Engine
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      document.documentElement.classList.add('ert-ready');
      const curtainBoxes = document.querySelectorAll('.ert-curtain-box');
      curtainBoxes.forEach(function (box) { box.classList.add('ert-curtain-init'); });

      if ('IntersectionObserver' in window) {
        const ertObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const el = entry.target;
              if (el.hasAttribute('data-ert')) el.classList.add('ert-visible');
              if (el.classList.contains('ert-curtain-box')) el.classList.add('ert-curtain-revealed');
              if (el.classList.contains('ert-gold-line')) el.classList.add('ert-line-drawn');
              ertObserver.unobserve(el);
            }
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

        document.querySelectorAll('[data-ert], .ert-curtain-box, .ert-gold-line').forEach(function (el, i) {
          if (el.hasAttribute('data-ert')) el.style.transitionDelay = ((i % 4) * 70) + 'ms';
          ertObserver.observe(el);
        });
      } else {
        document.querySelectorAll('[data-ert]').forEach(function (el) { el.classList.add('ert-visible'); });
        curtainBoxes.forEach(function (box) { box.classList.add('ert-curtain-revealed'); });
      }
    }

    // Cinematic Preloader Curtain Lift
    const preloader = document.getElementById('luxury-preloader');
    if (preloader) {
      setTimeout(function () {
        preloader.classList.add('preloader-done');
      }, 380);
    }


    // =========================================================================
    // UNIVERSAL MOUSE-REACTIVE MOTION ENGINE (3D Tilt, Magnetic CTAs, Hero Parallax)
    // =========================================================================
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // 1. Ambient gold follower ring
      let ring = document.getElementById('luxury-mouse-ring');
      if (!ring) {
        ring = document.createElement('div');
        ring.id = 'luxury-mouse-ring';
        ring.setAttribute('aria-hidden', 'true');
        document.body.appendChild(ring);
      }
      let ringX = -100, ringY = -100, targetX = -100, targetY = -100;
      let ringActive = false;

      document.addEventListener('mousemove', function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!ringActive) {
          ringActive = true;
          ring.classList.add('ring-visible');
        }
        const interactive = e.target && e.target.closest && e.target.closest('a, button, input, select, textarea, label, .mouse-tilt-el, .gallery-card-item');
        if (interactive) ring.classList.add('ring-expanded');
        else ring.classList.remove('ring-expanded');
      }, { passive: true });

      document.addEventListener('mouseleave', function () {
        ringActive = false;
        ring.classList.remove('ring-visible');
      });

      function animateRing() {
        ringX += (targetX - ringX) * 0.18;
        ringY += (targetY - ringY) * 0.18;
        const size = ring.classList.contains('ring-expanded') ? 23 : 14;
        ring.style.transform = 'translate3d(' + (ringX - size) + 'px, ' + (ringY - size) + 'px, 0)';
        requestAnimationFrame(animateRing);
      }
      requestAnimationFrame(animateRing);

      // 2. Attach 3D tilt + spotlight to static & dynamically rendered cards
      const TILT_SELECTOR = [
        '.card-luxury',
        '.service-card',
        '.gallery-card-item',
        '#avantages .grid > div',
        '#apropos .grid > div > div',
        '#apropos .bg-\[\#1B2B34\]',
        '#restaurant-menu-grid > div',
        '#testimonials-slider > article',
        '#acces .space-y-4 > div',
        '#acces .bg-\[\#1B2B34\]',
        '#reservation .bg-white',
        '#reservation .bg-\[\#1B2B34\]',
        '#accueil a.ert-curtain-box'
      ].join(', ');

      const MAG_SELECTOR = [
        'button',
        'header a',
        '#accueil a.block',
        '#acces a',
        '#reservation a'
      ].join(', ');

      function bindMouseMotion(root) {
        const scope = root || document;
        scope.querySelectorAll(TILT_SELECTOR).forEach(function (el) {
          if (el.dataset.mouseTiltBound) return;
          el.dataset.mouseTiltBound = '1';
          el.classList.add('mouse-tilt-el');

          el.addEventListener('mousemove', function (e) {
            const rect = el.getBoundingClientRect();
            const px = (e.clientX - rect.left) / Math.max(1, rect.width);
            const py = (e.clientY - rect.top) / Math.max(1, rect.height);
            const rotY = (px - 0.5) * 7.5;
            const rotX = (0.5 - py) * 6.5;
            el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
            el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
            el.style.transform = 'perspective(950px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translate3d(0, -6px, 0)';
          });

          el.addEventListener('mouseleave', function () {
            el.style.transform = '';
          });
        });

        scope.querySelectorAll(MAG_SELECTOR).forEach(function (btn) {
          if (btn.dataset.mouseMagBound) return;
          btn.dataset.mouseMagBound = '1';
          btn.classList.add('mouse-mag-el');

          btn.addEventListener('mousemove', function (e) {
            const rect = btn.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width / 2) * 0.16;
            const dy = (e.clientY - rect.top - rect.height / 2) * 0.16;
            btn.style.transform = 'translate3d(' + dx.toFixed(1) + 'px, ' + dy.toFixed(1) + 'px, 0) scale(1.02)';
          });

          btn.addEventListener('mouseleave', function () {
            btn.style.transform = '';
          });
        });
      }

      bindMouseMotion(document);

      // Re-bind automatically whenever dynamic grids (rooms, menu, gallery, testimonials) re-render
      ['rooms-grid', 'restaurant-menu-grid', 'gallery-grid', 'testimonials-slider'].forEach(function (gridId) {
        const node = document.getElementById(gridId);
        if (node && 'MutationObserver' in window) {
          new MutationObserver(function () {
            bindMouseMotion(node);
          }).observe(node, { childList: true });
        }
      });

      // 3. Hero depth parallax following mouse movement
      const heroSec = document.getElementById('accueil');
      if (heroSec) {
        const heroTitle = document.getElementById('hero-main-title');
        const heroBgImg = document.getElementById('hero-bg-image');
        heroSec.addEventListener('mousemove', function (e) {
          const rect = heroSec.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
          const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
          if (heroTitle) {
            heroTitle.style.transform = 'translate3d(' + (nx * -10).toFixed(1) + 'px, ' + (ny * -8).toFixed(1) + 'px, 0)';
          }
          if (heroBgImg) {
            heroBgImg.style.transform = 'scale(1.04) translate3d(' + (nx * 14).toFixed(1) + 'px, ' + (ny * 10).toFixed(1) + 'px, 0)';
          }
        }, { passive: true });
        heroSec.addEventListener('mouseleave', function () {
          if (heroTitle) heroTitle.style.transform = '';
          if (heroBgImg) heroBgImg.style.transform = '';
        });
      }
    }


    // =========================================================================
    // 2026 PREMIUM INTERACTIONS: RIPPLE, FAQ, BACK-TO-TOP, CURSOR TRAIL, FAILSAFE
    // =========================================================================

    // 1. Button Click Ripple Effect
    document.addEventListener('click', function (e) {
      const btn = e.target && e.target.closest && e.target.closest('button, a.btn-shimmer');
      if (!btn || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      btn.classList.add('btn-ripple-host');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const circle = document.createElement('span');
      circle.className = 'btn-ripple-circle';
      circle.style.width = size + 'px';
      circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(circle);
      setTimeout(function () { circle.remove(); }, 650);
    });

    // 2. Interactive FAQ Accordion
    document.querySelectorAll('#faq-accordion .faq-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const item = trigger.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('faq-open');
        document.querySelectorAll('#faq-accordion .faq-item').forEach(function (other) {
          other.classList.remove('faq-open');
          const t = other.querySelector('.faq-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('faq-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // 3. Back-to-Top Circular SVG Scroll Progress Button
    const bttBtn = document.getElementById('btn-back-to-top');
    const bttCircle = document.getElementById('btt-progress-circle');
    const bttCircumference = 125.66;
    if (bttBtn) {
      window.addEventListener('scroll', function () {
        const st = window.scrollY || document.documentElement.scrollTop;
        const dh = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = dh > 0 ? Math.min(1, st / dh) : 0;
        if (st > 320) bttBtn.classList.add('btt-visible');
        else bttBtn.classList.remove('btt-visible');
        if (bttCircle) {
          bttCircle.style.strokeDashoffset = (bttCircumference * (1 - ratio)).toFixed(2);
        }
      }, { passive: true });

      bttBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 4. KPI Progress Bars & Route Line Scroll Observer
    if ('IntersectionObserver' in window) {
      const barObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            if (el.classList.contains('kpi-progress-fill')) {
              const pct = el.getAttribute('data-fill') || '100%';
              el.style.width = pct;
              el.classList.add('bar-filled');
            }
            if (el.classList.contains('route-line-fill')) {
              el.classList.add('route-drawn');
            }
            barObs.unobserve(el);
          }
        });
      }, { threshold: 0.15 });

      document.querySelectorAll('.kpi-progress-fill, .route-line-fill').forEach(function (el) {
        barObs.observe(el);
      });
    } else {
      document.querySelectorAll('.kpi-progress-fill').forEach(function (el) { el.classList.add('bar-filled'); });
      document.querySelectorAll('.route-line-fill').forEach(function (el) { el.classList.add('route-drawn'); });
    }

    // 5. Form Invalid Shake & Voucher Success Pop Animation
    const bookingFormEl = document.getElementById('booking-form');
    if (bookingFormEl) {
      bookingFormEl.querySelectorAll('input[required]').forEach(function (inp) {
        inp.addEventListener('invalid', function () {
          inp.classList.remove('input-invalid-shake');
          void inp.offsetWidth;
          inp.classList.add('input-invalid-shake');
        });
      });
      bookingFormEl.addEventListener('submit', function () {
        const box = document.getElementById('booking-confirmation-box');
        if (box) {
          box.classList.remove('voucher-pop');
          void box.offsetWidth;
          box.classList.add('voucher-pop');
        }
      });
    }

    // 6. Lightweight Pooled 4-Dot Gold Cursor Trail (Desktop pointer-fine only)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const trailDots = [];
      const trailPos = [];
      for (let i = 0; i < 4; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail-dot';
        dot.setAttribute('aria-hidden', 'true');
        dot.style.transform = 'translate3d(-50px,-50px,0)';
        document.body.appendChild(dot);
        trailDots.push(dot);
        trailPos.push({ x: -50, y: -50 });
      }
      let mx = -50, my = -50, trailVisible = false;
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX;
        my = e.clientY;
        if (!trailVisible) {
          trailVisible = true;
          trailDots.forEach(function (d, idx) { d.style.opacity = String((0.45 - idx * 0.09).toFixed(2)); });
        }
      }, { passive: true });
      document.addEventListener('mouseleave', function () {
        trailVisible = false;
        trailDots.forEach(function (d) { d.style.opacity = '0'; });
      });
      function tickTrail() {
        let px = mx, py = my;
        for (let i = 0; i < trailDots.length; i++) {
          trailPos[i].x += (px - trailPos[i].x) * (0.28 - i * 0.04);
          trailPos[i].y += (py - trailPos[i].y) * (0.28 - i * 0.04);
          trailDots[i].style.transform = 'translate3d(' + (trailPos[i].x - 3).toFixed(1) + 'px, ' + (trailPos[i].y - 3).toFixed(1) + 'px, 0) scale(' + (1 - i * 0.16).toFixed(2) + ')';
          px = trailPos[i].x;
          py = trailPos[i].y;
        }
        requestAnimationFrame(tickTrail);
      }
      requestAnimationFrame(tickTrail);
    }

    // 7. Failsafe: Guarantee No Content Ever Stays Hidden
    setTimeout(function () {
      document.querySelectorAll('[data-ert]').forEach(function (el) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.15) el.classList.add('ert-visible');
      });
      document.querySelectorAll('.ert-curtain-box').forEach(function (el) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.15) el.classList.add('ert-curtain-revealed');
      });
      document.querySelectorAll('.ert-gold-line').forEach(function (el) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.15) el.classList.add('ert-line-drawn');
      });
    }, 1200);


    // =========================================================================
    // MULTI-LAYER 3D PARALLAX, SCROLL-BASED OBJECT ANIMATIONS & FLOW LIGHTBOX
    // =========================================================================

    // 1. Populate & Bind Seamless Horizontal Photo Flow (Zero-Stutter Infinite Loop)
    const flowTop = document.getElementById('infinite-photo-flow-top');
    if (flowTop) {
      const flowItems = [
        { img: INITIAL_ROOMS[2].image, title: 'Suite Prestige • 30 000 FCFA', cat: 'Suite VIP' },
        { img: INITIAL_ROOMS[1].image, title: 'Chambre Exécutive • 22 000 FCFA', cat: 'Affaires' },
        { img: INITIAL_ROOMS[0].image, title: 'Chambre Classique • 15 000 FCFA', cat: 'Classique' },
        { img: INITIAL_GALLERY[3].image, title: 'Cour & Cocotiers • Lokossa', cat: 'Extérieur' }
      ];
      const doubled = flowItems.concat(flowItems);
      flowTop.innerHTML = doubled.map(function (item, idx) {
        return (
          '<div class="flow-card w-64 sm:w-72 h-40 cursor-pointer bg-[#131F26]" data-flow-idx="' + (idx % flowItems.length) + '">' +
            '<img src="' + item.img + '" alt="' + item.title + '" class="w-full h-full object-cover" />' +
            '<div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-3">' +
              '<span class="text-xs font-headline font-bold uppercase text-white">' + item.title + '</span>' +
            '</div>' +
          '</div>'
        );
      }).join('');
      flowTop.querySelectorAll('.flow-card').forEach(function (card) {
        card.addEventListener('click', function () {
          const item = flowItems[parseInt(card.getAttribute('data-flow-idx'), 10) || 0];
          if (item) {
            openLightboxCustom(item.img, item.title, item.cat, 'Photographie officielle de l’Auberge Les Cocotiers de Lokossa (3ème von après la Préfecture à droite).');
          }
        });
      });
    }

    // 2. GSAP ScrollTrigger Multi-Layer 3D Parallax & Scroll-Synced Object Rotations/Scales
    if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;

      // Multi-layer vertical parallax on all [data-parallax-speed] objects
      if (isDesktop) {
        document.querySelectorAll('[data-parallax-speed]').forEach(function (el) {
          const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.15;
          window.gsap.to(el, {
            y: speed * 140,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('section') || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        });
      }

      // Scroll-synced continuous rotation on decorative compass/emblem in #acces
      document.querySelectorAll('.scroll-spin-emblem').forEach(function (emblem) {
        window.gsap.to(emblem, {
          rotation: 180,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: emblem.closest('section') || emblem,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        });
      });

      // Scroll-based scale & elevation on 3D Orbit Stage
      const orbitStage = document.querySelector('.orbit-stage');
      if (orbitStage) {
        window.gsap.fromTo(orbitStage,
          { scale: 0.9, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: orbitStage,
              start: 'top 90%',
              end: 'center center',
              scrub: 0.7
            }
          }
        );
      }
    }


    // =========================================================================
    // ROOM VIDEO SHOWCASE & CINEMA PLAYER (MP4 + INTERACTIVE MOTION TOUR)
    // =========================================================================
    const ROOM_VIDEOS = [
      {
        id: 'vid-suite',
        roomId: 'suite-prestige',
        title: 'Suite Prestige Les Cocotiers',
        category: 'Suite',
        duration: '00:18',
        poster: INITIAL_ROOMS[2].image,
        videoUrl: '',
        specs: '42 m² • Lit King Size • 30 000 FCFA / nuit',
        desc: 'Visite complète de notre Suite Prestige : grand lit King Size, tête de lit en teck, coin salon et vue apaisante sur les cocotiers.'
      },
      {
        id: 'vid-executive',
        roomId: 'chambre-executive',
        title: 'Chambre Exécutive Confort',
        category: 'Exécutive',
        duration: '00:15',
        poster: INITIAL_ROOMS[1].image,
        videoUrl: '',
        specs: '30 m² • Bureau Exécutif • 22 000 FCFA / nuit',
        desc: 'Découvrez la Chambre Exécutive pensée pour les missions professionnelles à Lokossa : bureau en bois massif, climatisation split et calme absolu.'
      },
      {
        id: 'vid-classique',
        roomId: 'chambre-classique',
        title: 'Chambre Classique Élégance',
        category: 'Classique',
        duration: '00:15',
        poster: INITIAL_ROOMS[0].image,
        videoUrl: '',
        specs: '24 m² • Douche Italienne • 15 000 FCFA / nuit',
        desc: 'Parcourez la Chambre Classique Élégance : luminosité naturelle, draps en coton blanc supérieur et salle de bain moderne étincelante.'
      }
    ];

    let activeVideoFilter = 'all';
    let currentVideoItem = null;
    let tourTimer = null;
    let tourElapsed = 0;
    let tourPlaying = false;

    function renderRoomVideos() {
      const grid = document.getElementById('room-videos-grid');
      if (!grid) return;
      const list = activeVideoFilter === 'all'
        ? ROOM_VIDEOS
        : ROOM_VIDEOS.filter(function (v) { return v.category === activeVideoFilter; });

      grid.innerHTML = list.map(function (v, idx) {
        const badgeLabel = v.videoUrl ? 'Vidéo MP4 HD' : 'Visite Vidéo • ' + v.duration;
        return (
          '<article style="animation-delay:' + (idx * 90) + 'ms" class="ert-cascade-item card-luxury mouse-tilt-el bg-[#1B2B34] border border-white/10 overflow-hidden flex flex-col justify-between shadow-xl group">' +
            '<div class="relative h-60 overflow-hidden bg-black cursor-pointer btn-play-room-video" data-vid-id="' + v.id + '">' +
              '<img src="' + v.poster + '" alt="Vidéo ' + v.title + '" class="room-img-zoom w-full h-full object-cover opacity-90 group-hover:opacity-100" />' +
              '<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20"></div>' +
              '<span class="absolute top-3.5 left-3.5 px-3 py-1 bg-[#131F26]/90 border border-[#CDA26B]/50 text-[#E5CBA8] text-[10px] font-headline font-bold uppercase tracking-widest">' + badgeLabel + '</span>' +
              '<div class="absolute inset-0 flex items-center justify-center">' +
                '<div class="video-play-ring relative w-14 h-14 rounded-full bg-[#CDA26B]/95 group-hover:bg-[#CDA26B] text-white flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">' +
                  '<i data-lucide="play" class="w-6 h-6 fill-white ml-0.5"></i>' +
                '</div>' +
              '</div>' +
              '<div class="absolute bottom-3.5 left-4 right-4">' +
                '<span class="text-[10px] uppercase tracking-wider text-[#CDA26B] font-semibold block">' + v.specs + '</span>' +
                '<h3 class="font-headline text-lg font-bold uppercase text-white leading-tight mt-0.5">' + v.title + '</h3>' +
              '</div>' +
            '</div>' +
            '<div class="p-5 flex flex-col justify-between gap-4 flex-1">' +
              '<p class="text-xs sm:text-sm text-zinc-300 leading-relaxed">' + v.desc + '</p>' +
              '<div class="pt-3 border-t border-white/10 flex items-center justify-between gap-2">' +
                '<button type="button" class="btn-play-room-video text-xs font-headline font-bold uppercase tracking-wider text-[#CDA26B] hover:text-white flex items-center gap-1.5 transition-colors" data-vid-id="' + v.id + '">' +
                  '<i data-lucide="film" class="w-3.5 h-3.5"></i>' +
                  '<span>Regarder la visite</span>' +
                '</button>' +
                '<button type="button" class="btn-video-book-direct px-3.5 py-2 bg-[#CDA26B] hover:bg-[#B78B52] text-white text-[11px] font-headline font-bold uppercase tracking-wider transition-colors" data-room-id="' + v.roomId + '">' +
                  'Réserver' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</article>'
        );
      }).join('');

      grid.querySelectorAll('.btn-play-room-video').forEach(function (el) {
        el.addEventListener('click', function () {
          openVideoPlayer(el.getAttribute('data-vid-id'));
        });
      });
      grid.querySelectorAll('.btn-video-book-direct').forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectRoomForBooking(btn.getAttribute('data-room-id'), true);
        });
      });

      if (window.lucide) window.lucide.createIcons();
    }

    function renderStudioVideoList() {
      const listEl = document.getElementById('studio-video-list');
      if (!listEl) return;
      listEl.innerHTML = ROOM_VIDEOS.map(function (v) {
        const status = v.videoUrl ? 'Vidéo MP4 chargée' : 'Visite cinématique par défaut';
        return (
          '<div class="flex items-center justify-between gap-3 p-3 border border-zinc-200 bg-white">' +
            '<div>' +
              '<div class="text-sm font-headline font-bold text-[#1B2B34]">' + v.title + '</div>' +
              '<div class="text-xs text-zinc-500">' + status + '</div>' +
            '</div>' +
            '<label class="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1B2B34] hover:bg-[#CDA26B] text-white text-xs font-headline font-semibold uppercase tracking-wider shrink-0 transition-colors">' +
              '<i data-lucide="video" class="w-3.5 h-3.5"></i>' +
              '<span>Importer MP4</span>' +
              '<input type="file" accept="video/mp4,video/webm,video/quicktime,video/*" class="hidden studio-video-upload" data-vid-id="' + v.id + '" />' +
            '</label>' +
          '</div>'
        );
      }).join('');

      listEl.querySelectorAll('.studio-video-upload').forEach(function (inp) {
        inp.addEventListener('change', function (e) {
          const vId = e.target.getAttribute('data-vid-id');
          const file = e.target.files && e.target.files[0];
          if (vId && file) attachLocalVideoToRoom(vId, file);
        });
      });
      if (window.lucide) window.lucide.createIcons();
    }

    function attachLocalVideoToRoom(vidId, file) {
      const target = ROOM_VIDEOS.find(function (v) { return v.id === vidId; });
      if (!target) return;
      const objUrl = URL.createObjectURL(file);
      target.videoUrl = objUrl;
      renderRoomVideos();
      renderStudioVideoList();
      if (currentVideoItem && currentVideoItem.id === vidId) {
        openVideoPlayer(vidId);
      }
      showToast('Vidéo « ' + file.name + ' » associée à ' + target.title + ' !');
    }

    function stopMotionTourTimer() {
      if (tourTimer) {
        clearInterval(tourTimer);
        tourTimer = null;
      }
      tourPlaying = false;
    }

    function startMotionTourTimer() {
      stopMotionTourTimer();
      tourPlaying = true;
      const totalSec = 15;
      const progEl = document.getElementById('vp-tour-progress');
      const timerEl = document.getElementById('vp-timer');
      const imgEl = document.getElementById('vp-motion-img');
      const playLbl = document.getElementById('vp-play-label');
      if (imgEl) imgEl.classList.remove('cinema-tour-paused');
      if (playLbl) playLbl.textContent = 'Pause';

      tourTimer = setInterval(function () {
        tourElapsed = (tourElapsed + 0.25) % totalSec;
        const pct = (tourElapsed / totalSec) * 100;
        if (progEl) progEl.style.width = pct.toFixed(1) + '%';
        if (timerEl) {
          const sec = Math.floor(tourElapsed);
          timerEl.textContent = '00:' + (sec < 10 ? '0' + sec : sec) + ' / 00:15';
        }
      }, 250);
    }

    function openVideoPlayer(vidId) {
      const item = ROOM_VIDEOS.find(function (v) { return v.id === vidId; });
      if (!item) return;
      currentVideoItem = item;
      const modal = document.getElementById('video-player-modal');
      const nativeVid = document.getElementById('vp-native-video');
      const motionStage = document.getElementById('vp-motion-stage');
      const motionImg = document.getElementById('vp-motion-img');
      const catEl = document.getElementById('vp-cat');
      const titleEl = document.getElementById('vp-title');
      const descEl = document.getElementById('vp-desc');
      const specsEl = document.getElementById('vp-specs');

      if (catEl) catEl.textContent = item.videoUrl ? 'Vidéo Officielle HD' : 'Visite Vidéo • ' + item.category;
      if (titleEl) titleEl.textContent = item.title;
      if (descEl) descEl.textContent = item.desc;
      if (specsEl) specsEl.textContent = item.specs;

      if (item.videoUrl && nativeVid && motionStage) {
        stopMotionTourTimer();
        motionStage.classList.add('hidden');
        nativeVid.classList.remove('hidden');
        nativeVid.src = item.videoUrl;
        nativeVid.poster = item.poster;
        nativeVid.play().catch(function () {});
      } else if (nativeVid && motionStage) {
        nativeVid.pause();
        nativeVid.classList.add('hidden');
        motionStage.classList.remove('hidden');
        if (motionImg) motionImg.src = item.poster;
        tourElapsed = 0;
        startMotionTourTimer();
      }
      openModalSmooth(modal);
    }

    function closeVideoPlayer() {
      const modal = document.getElementById('video-player-modal');
      const nativeVid = document.getElementById('vp-native-video');
      stopMotionTourTimer();
      if (nativeVid) {
        nativeVid.pause();
        nativeVid.currentTime = 0;
      }
      closeModalSmooth(modal);
    }

    const btnCloseVideo = document.getElementById('btn-close-video');
    const videoModalEl = document.getElementById('video-player-modal');
    if (btnCloseVideo) btnCloseVideo.addEventListener('click', closeVideoPlayer);
    if (videoModalEl) {
      videoModalEl.addEventListener('click', function (e) {
        if (e.target === videoModalEl) closeVideoPlayer();
      });
    }

    const btnVpToggle = document.getElementById('btn-vp-toggle-play');
    if (btnVpToggle) {
      btnVpToggle.addEventListener('click', function () {
        const imgEl = document.getElementById('vp-motion-img');
        const playLbl = document.getElementById('vp-play-label');
        if (tourPlaying) {
          stopMotionTourTimer();
          if (imgEl) imgEl.classList.add('cinema-tour-paused');
          if (playLbl) playLbl.textContent = 'Lire';
        } else {
          startMotionTourTimer();
        }
      });
    }

    const btnVpBook = document.getElementById('btn-vp-book');
    if (btnVpBook) {
      btnVpBook.addEventListener('click', function () {
        const targetRoomId = currentVideoItem ? currentVideoItem.roomId : 'chambre-executive';
        closeVideoPlayer();
        selectRoomForBooking(targetRoomId, true);
      });
    }

    const vpDirectUpload = document.getElementById('vp-direct-video-upload');
    if (vpDirectUpload) {
      vpDirectUpload.addEventListener('change', function (e) {
        const file = e.target.files && e.target.files[0];
        if (file && currentVideoItem) {
          attachLocalVideoToRoom(currentVideoItem.id, file);
        }
      });
    }

    document.querySelectorAll('.video-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeVideoFilter = btn.getAttribute('data-vfilter') || 'all';
        document.querySelectorAll('.video-filter-btn').forEach(function (b) {
          b.className = 'video-filter-btn px-4 py-2.5 text-xs font-headline font-semibold uppercase tracking-wider bg-white/10 text-zinc-200 hover:bg-white/20 transition-all';
        });
        btn.className = 'video-filter-btn px-4 py-2.5 text-xs font-headline font-bold uppercase tracking-wider bg-[#CDA26B] text-white transition-all';
        renderRoomVideos();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && videoModalEl && !videoModalEl.classList.contains('hidden')) {
        closeVideoPlayer();
      }
    });

    renderRoomVideos();
    renderStudioVideoList();

    if (window.lucide) window.lucide.createIcons();
  });
})();

/* Trajet animé : la voiture suit l'itinéraire depuis la Préfecture */
(function () {
  var svg = document.getElementById('trip-map');
  if (!svg) return;
  var path = document.getElementById('trip-path');
  var trail = document.getElementById('trip-trail');
  var glow = document.getElementById('trip-trail-glow');
  var car = document.getElementById('trip-car');
  var bar = document.getElementById('trip-progress-bar');
  var steps = document.querySelectorAll('[data-trip-step]');
  var replay = document.getElementById('trip-replay');
  var total = path.getTotalLength();
  // Longueur du tracé à laquelle la voiture atteint chaque repère
  var marks = [161, 386, 521, 608, total - 1];
  var DURATION = 11000;
  var raf = null;
  var started = false;

  [trail, glow].forEach(function (el) { el.style.strokeDasharray = total; el.style.strokeDashoffset = total; });

  function ease(t) { return 0.5 - 0.5 * Math.cos(Math.PI * t); }

  function draw(len) {
    var a = path.getPointAtLength(Math.max(len - 1, 0));
    var b = path.getPointAtLength(Math.min(len + 1, total));
    var p = path.getPointAtLength(len);
    var angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    car.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ') rotate(' + angle.toFixed(2) + ')');
    trail.style.strokeDashoffset = total - len;
    glow.style.strokeDashoffset = total - len;
    bar.style.width = (len / total * 100) + '%';
    var current = -1;
    for (var i = 0; i < marks.length; i++) if (len >= marks[i] - 4) current = i;
    steps.forEach(function (el, i) {
      el.classList.toggle('is-active', i === current);
      el.classList.toggle('is-done', i < current);
    });
    svg.classList.toggle('is-arrived', len >= total - 1);
  }

  function play() {
    if (raf) cancelAnimationFrame(raf);
    started = true;
    svg.classList.remove('is-arrived');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { draw(total); return; }
    var t0 = null;
    draw(0);
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var t = Math.min((ts - t0) / DURATION, 1);
      draw(ease(t) * total);
      if (t < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }

  draw(0);
  if (replay) replay.addEventListener('click', play);

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !started) { play(); io.disconnect(); }
      });
    }, { threshold: 0.45 });
    io.observe(svg);
  } else {
    play();
  }
})();
