document.addEventListener('DOMContentLoaded', function () {
    const marquee1 = document.getElementById('marquee-track-1');
    const marquee2 = document.getElementById('marquee-track-2');
    const badgesCompetences = document.getElementById('badges-competences');

    if (!marquee1 && !badgesCompetences) return;

    function chargerJson(url) {
        return fetch(url).then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        });
    }

    Promise.all([
        chargerJson('/data/competences.json'),
        // Si les projets ne se chargent pas, on affiche toutes les compétences plutôt que rien
        chargerJson('/data/projets.json').catch(() => null)
    ])
        .then(([toutes, projets]) => {
            // On ne garde que les compétences liées à au moins un projet,
            // sinon le lien /projets?competence=... mène à une page vide
            let competences = toutes;
            if (Array.isArray(projets)) {
                const utilisees = new Set(projets.flatMap(p => p.tags || []));
                competences = toutes.filter(comp => utilisees.has(comp));
            }

            // --- Marquee de la page d'accueil ---
            if (marquee1 && marquee2) {
                [marquee1, marquee2].forEach((track, index) => {
                    track.innerHTML = '';
                    if (index === 1) track.setAttribute('aria-hidden', 'true');

                    competences.forEach((comp, i) => {
                        const lien = document.createElement('a');
                        lien.href = `/projets?competence=${encodeURIComponent(comp)}`;
                        lien.className = 'marquee-item';
                        lien.textContent = comp;
                        if (index === 1) lien.tabIndex = -1;
                        track.appendChild(lien);

                        if (i < competences.length - 1) {
                            const sep = document.createElement('span');
                            sep.className = 'marquee-sep';
                            sep.textContent = '•';
                            track.appendChild(sep);
                        }
                    });
                });
            }

            // --- Badges compétences de la page à propos ---
            if (badgesCompetences) {
                badgesCompetences.innerHTML = '';
                competences.forEach(comp => {
                    const lien = document.createElement('a');
                    lien.href = `/projets?competence=${encodeURIComponent(comp)}`;
                    lien.className = 'badge-tech';
                    lien.textContent = comp;
                    badgesCompetences.appendChild(lien);
                });
            }
        })
        .catch(error => {
            console.error('Erreur de chargement des compétences:', error);
        });
});
