document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('projets-container');
    const compteur = document.getElementById('compteur-projets');
    const filtresContainer = document.querySelector('.filtres-container');
    const resultatsSpan = document.querySelector('.filtres-resultats');

    if (!container) return;

    let tousLesProjets = [];
    let filtreActif = 'tous';

    // Le compteur reste caché tant que les projets ne sont pas chargés (évite "0 projet(s)")
    const zoneCompteur = resultatsSpan || (compteur ? compteur.parentElement : null);
    if (zoneCompteur) zoneCompteur.style.visibility = 'hidden';

    // --- UTILITAIRES ---
    // Enlève accents et majuscules : "terminé" et "termine" donnent la même clé
    function normaliser(texte) {
        return String(texte || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    function echapper(texte) {
        return String(texte == null ? '' : texte).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function capitaliser(texte) {
        return texte ? texte.charAt(0).toUpperCase() + texte.slice(1) : texte;
    }

    function isValidLink(url) {
        return url && url !== '#' && url.trim() !== '';
    }

    function chargerJson(url) {
        return fetch(url).then(function (response) {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        });
    }

    // --- MAPPINGS (clés sans accents) ---
    const statutLabels = {
        'termine': 'Terminé',
        'en-cours': 'En cours',
        'a-venir': 'À venir',
        'brouillon': 'Brouillon'
    };
    const typeLabels = {
        'personnel': 'Personnel',
        'academique': 'Académique',
        'stage': 'Stage'
    };

    function getStatutKey(statut) {
        const cle = normaliser(statut);
        return statutLabels[cle] ? cle : 'brouillon';
    }
    function getStatutClass(statut) {
        return 'badge-statut badge-statut-' + getStatutKey(statut);
    }
    function getStatutLabel(statut) {
        return statutLabels[getStatutKey(statut)];
    }
    function getTypeKey(type) {
        const cle = normaliser(type);
        return typeLabels[cle] ? cle : null;
    }
    function getTypeClass(type) {
        const cle = getTypeKey(type);
        return cle ? 'badge-type badge-type-' + cle : 'badge-type';
    }
    function getTypeLabel(type) {
        const cle = getTypeKey(type);
        return cle ? typeLabels[cle] : capitaliser(type);
    }
    // "en autonomie" -> "En autonomie", "équipe de 4 (...)" -> "Équipe de 4 (...)"
    function getCollabLabel(collab) {
        return capitaliser(collab);
    }

    // --- AFFICHAGE ---
    function afficherProjets() {
        let projetsFiltres = tousLesProjets;

        if (filtreActif !== 'tous') {
            projetsFiltres = tousLesProjets.filter(function (projet) {
                return (projet.tags || []).indexOf(filtreActif) !== -1;
            });
        }

        container.innerHTML = '';

        if (projetsFiltres.length === 0) {
            container.innerHTML =
                '<div class="aucun-projet">' +
                '<h3>Aucun projet trouvé pour cette compétence</h3>' +
                '<p><a href="/projets" class="lien-retour">Voir tous les projets</a></p>' +
                '</div>';
            if (compteur) compteur.textContent = '0';
            return;
        }

        if (compteur) compteur.textContent = projetsFiltres.length;

        projetsFiltres.forEach(function (projet) {
            const article = document.createElement('article');
            article.className = 'carte-projet';
            if (projet.phare) article.classList.add('carte-projet-phare');

            const tags = projet.tags || [];
            const statut = projet.statut || 'brouillon';
            const type = projet.type || 'personnel';
            const collaboration = projet.collaboration || 'en autonomie';

            const filtreSurTag = filtreActif !== 'tous' && tags.indexOf(filtreActif) !== -1;
            if (filtreSurTag) article.classList.add('carte-surlignee');

            // Pastilles de stack
            let badges = '';
            tags.forEach(function (tag) {
                const estActif = filtreActif !== 'tous' && tag === filtreActif;
                badges += '<span class="badge' + (estActif ? ' badge-surlignee' : '') + '">' + echapper(tag) + '</span>';
            });

            // Boutons d'action
            const actions = [];
            if (isValidLink(projet.lien_demo)) {
                actions.push('<a href="' + echapper(projet.lien_demo) + '" target="_blank" rel="noopener" class="btn-action btn-demo">Voir la démo</a>');
            }
            if (isValidLink(projet.lien_code)) {
                actions.push('<a href="' + echapper(projet.lien_code) + '" target="_blank" rel="noopener" class="btn-action btn-demo">Voir le code</a>');
            }
            if (isValidLink(projet.lien_video)) {
                actions.push('<a href="' + echapper(projet.lien_video) + '" target="_blank" rel="noopener" class="btn-action btn-video">Voir la vidéo</a>');
            }
            const actionsHtml = actions.length > 0
                ? '<div class="actions-projet">' + actions.join('') + '</div>'
                : '';

            // Résumé + puces (si absents, on retombe sur la description complète)
            const points = Array.isArray(projet.points) ? projet.points : [];
            const resumeHtml = projet.resume
                ? '<p class="resume-projet">' + echapper(projet.resume) + '</p>'
                : '';
            const pointsHtml = points.length > 0
                ? '<ul class="points-projet">' + points.map(function (p) { return '<li>' + echapper(p) + '</li>'; }).join('') + '</ul>'
                : '';

            // Description complète seulement si le projet n'a ni résumé ni puces
            let detailsHtml = '';
            if (!resumeHtml && !pointsHtml && projet.description) {
                detailsHtml = '<p class="description">' + echapper(projet.description) + '</p>';
            }

            const dureeTexte = projet.duree || '';
            const collabLabel = getCollabLabel(collaboration);
            const affichageDuree = dureeTexte ? dureeTexte + ' · ' + collabLabel : collabLabel;

            const badgePhare = projet.phare ? '<span class="badge-phare">★ Projet phare</span>' : '';

            article.innerHTML =
                '<div class="badges-haut meta-badges">' +
                    badgePhare +
                    '<span class="' + getStatutClass(statut) + '">' + getStatutLabel(statut) + '</span>' +
                    '<span class="' + getTypeClass(type) + '">' + echapper(getTypeLabel(type)) + '</span>' +
                '</div>' +
                '<h2>' + echapper(projet.titre || 'Sans titre') + '</h2>' +
                '<p class="duree-projet">' + echapper(affichageDuree) + '</p>' +
                '<div class="corps-projet">' + resumeHtml + pointsHtml + detailsHtml + '</div>' +
                '<div class="badges">' + badges + '</div>' +
                actionsHtml;

            container.appendChild(article);
        });
    }

    // --- FILTRES ---
    function marquerBoutonActif(categorie) {
        document.querySelectorAll('.filtre-btn').forEach(function (b) {
            b.classList.toggle('active', b.dataset.categorie === categorie);
        });
    }

    function activerFiltre(categorie) {
        marquerBoutonActif(categorie);
        filtreActif = categorie;

        const url = new URL(window.location.href);
        if (categorie === 'tous') {
            url.searchParams.delete('competence');
        } else {
            url.searchParams.set('competence', categorie);
        }
        window.history.pushState({}, '', url);

        afficherProjets();
    }

    if (filtresContainer) {
        filtresContainer.addEventListener('click', function (e) {
            const btn = e.target.closest('.filtre-btn');
            if (!btn) return;
            activerFiltre(btn.dataset.categorie);
        });
    }

    window.addEventListener('popstate', function () {
        const params = new URLSearchParams(window.location.search);
        const competence = params.get('competence') || 'tous';
        marquerBoutonActif(competence);
        filtreActif = competence;
        afficherProjets();
    });

    // Ne crée un bouton que pour les compétences liées à au moins un projet
    function construireFiltres(competences) {
        if (!filtresContainer || !resultatsSpan) return;

        const utilisees = new Set();
        tousLesProjets.forEach(function (projet) {
            (projet.tags || []).forEach(function (tag) { utilisees.add(tag); });
        });

        competences.forEach(function (comp) {
            if (!utilisees.has(comp)) return;
            const btn = document.createElement('button');
            btn.className = 'filtre-btn';
            btn.dataset.categorie = comp;
            btn.textContent = comp;
            filtresContainer.insertBefore(btn, resultatsSpan);
        });
    }

    // --- CHARGEMENT ---
    Promise.all([
        chargerJson('/data/projets.json'),
        chargerJson('/data/competences.json').catch(function (error) {
            console.error('Erreur de chargement des compétences:', error);
            return [];
        })
    ])
        .then(function (resultats) {
            tousLesProjets = resultats[0];
            construireFiltres(resultats[1]);

            const params = new URLSearchParams(window.location.search);
            const competence = params.get('competence');
            if (competence) {
                filtreActif = competence;
                marquerBoutonActif(competence);
            }

            afficherProjets();
            if (zoneCompteur) zoneCompteur.style.visibility = '';
        })
        .catch(function (error) {
            console.error('Erreur:', error);
            container.innerHTML = '<p class="error">Erreur de chargement des projets</p>';
            if (zoneCompteur) zoneCompteur.style.visibility = '';
        });
});
