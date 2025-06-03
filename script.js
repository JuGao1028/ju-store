document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };
    const sectionObserver = new IntersectionObserver(sectionCallback, observerOptions);
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animated-section');
        sectionObserver.observe(section);
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineItemCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };
    const timelineObserver = new IntersectionObserver(timelineItemCallback, {...observerOptions, threshold: 0.2 });
    
    timelineItems.forEach((item) => {
        timelineObserver.observe(item);
    });


    if (document.getElementById('map')) {
        const map = L.map('map').setView([21.9588, 96.0891], 6); 

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors. Tiles may be subject to usage policy.'
        }).addTo(map);

        const locations = [
            { 
                coords: [21.9588, 96.0891], 
                title: '曼德勒地区 (震中附近)', 
                description: '里氏 7.9 级强震主要影响区域。<br>震源深度: 约10-20公里。<br>灾情严重，大量建筑损毁。' 
            },
            { 
                coords: [19.7633, 96.0785], 
                title: '内比都 (首都)', 
                description: '缅甸首都，亦受到地震波及，<br>部分基础设施可能受影响。' 
            },
            { 
                coords: [21.1719, 94.8585], 
                title: '蒲甘 (历史古城)', 
                description: '世界文化遗产地，<br>需关注古塔等历史建筑受损情况。'
            }
        ];

        locations.forEach(loc => {
            L.marker(loc.coords).addTo(map)
                .bindPopup(`<strong>${loc.title}</strong><br>${loc.description}`);
        });
        
        L.marker(locations[0].coords).addTo(map).bindPopup(`<strong>${locations[0].title}</strong><br>${locations[0].description}`).openPopup();


        L.circle(locations[0].coords, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2,
            radius: 150000 // Approx 150km radius as a broader indication
        }).addTo(map).bindPopup("主要影响范围 (示意)");
    }


    const chartOptionsBase = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#475569',
                    padding: 15,
                    font: { size: 13 }
                }
            },
            tooltip: {
                titleFont: { weight: 'bold', size: 14 },
                bodyFont: { size: 12 },
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                padding: 10,
                cornerRadius: 4,
                callbacks: {} 
            }
        },
        color: '#334155',
        font: {
            family: "\"Noto Sans SC\", \"PingFang SC\", \"Lantinghei SC\", \"Microsoft YaHei\", \"HanHei SC\", \"Helvetica Neue\", \"Open Sans\", Arial, \"Hiragino Sans GB\", \"Source Han Sans CN\", \"Source Han Sans SC\", \"WenQuanYi Micro Hei\", sans-serif",
        }
    };
    
    Chart.defaults.font.family = chartOptionsBase.font.family;
    Chart.defaults.color = chartOptionsBase.color;


    const earthquakeParamsCtx = document.getElementById('earthquakeParamsChart');
    if (earthquakeParamsCtx) {
        new Chart(earthquakeParamsCtx, {
            type: 'bar',
            data: {
                labels: ['震级 (里氏)', '震源深度 (公里)'],
                datasets: [{
                    label: '数值',
                    data: [7.9, 15], 
                    backgroundColor: [
                        'rgba(245, 158, 11, 0.7)', 
                        'rgba(20, 184, 166, 0.7)'  
                    ],
                    borderColor: [
                        'rgb(245, 158, 11)',
                        'rgb(20, 184, 166)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptionsBase,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#475569' },
                        grid: { color: '#e2e8f0' } 
                    },
                    x: {
                        ticks: { color: '#475569' },
                        grid: { display: false }
                    }
                },
                plugins: {
                    ...chartOptionsBase.plugins,
                    legend: { display: false },
                    tooltip: {
                        ...chartOptionsBase.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y;
                                    if (context.label === '震级 (里氏)') label += ' 级';
                                    if (context.label === '震源深度 (公里)') label += ' 公里 (平均估算)';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }


    const casualtiesCtx = document.getElementById('casualtiesChart');
    if (casualtiesCtx) {
        new Chart(casualtiesCtx, {
            type: 'pie',
            data: {
                labels: ['死亡 (估算)', '受伤 (估算)', '失踪 (估算)'],
                datasets: [{
                    data: [1200, 8000, 500], 
                    backgroundColor: [
                        'rgba(220, 38, 38, 0.7)',  // red-600
                        'rgba(234, 179, 8, 0.7)',  // yellow-500
                        'rgba(59, 130, 246, 0.7)' // blue-500
                    ],
                    borderColor: [
                        'rgb(220, 38, 38)',
                        'rgb(234, 179, 8)',
                        'rgb(59, 130, 246)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 8
                }]
            },
            options: {
                ...chartOptionsBase,
                 plugins: {
                    ...chartOptionsBase.plugins,
                    legend: {
                        position: 'bottom',
                         labels: { ...chartOptionsBase.plugins.legend.labels }
                    },
                    tooltip: {
                        ...chartOptionsBase.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed.toLocaleString() + ' 人';
                                }
                                return label;
                            },
                            afterLabel: function() {
                                return '注意: 此数据为早期估算，具体数字以官方发布为准。';
                            }
                        }
                    }
                }
            }
        });
    }


    const rescueEffortsCtx = document.getElementById('rescueEffortsChart');
    if (rescueEffortsCtx) {
        new Chart(rescueEffortsCtx, {
            type: 'bar',
            data: {
                labels: ['中国救援力量', '其他国际/国内救援队'],
                datasets: [{
                    label: '信息提及次数',
                    data: [108, 24], 
                    backgroundColor: [
                        'rgba(13, 148, 136, 0.7)',  
                        'rgba(99, 102, 241, 0.7)'   
                    ],
                    borderColor: [
                        'rgb(13, 148, 136)',
                        'rgb(99, 102, 241)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                 ...chartOptionsBase,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '信息提及次数 (反映媒体关注度与报告活跃度)',
                            color: '#475569',
                            font: { size: 11, weight: 'normal' }
                        },
                        ticks: { color: '#475569' },
                        grid: { color: '#e2e8f0' }
                    },
                    y: {
                        ticks: { color: '#475569', font: {size: 11} },
                        grid: { display: false }
                    }
                },
                 plugins: {
                    ...chartOptionsBase.plugins,
                    legend: { display: false },
                    tooltip: {
                        ...chartOptionsBase.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.x !== null) {
                                    label += context.parsed.x + ' 次';
                                }
                                return label;
                            },
                             afterLabel: function() {
                                return '注: 此数据基于公开信息提及频次分析，不代表实际投入规模。';
                            }
                        }
                    }
                }
            }
        });
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgElement = item.querySelector('img');
            const captionElement = item.querySelector('p');
            lightboxImg.src = imgElement.src;
            lightboxCaption.textContent = captionElement.textContent;
            lightbox.classList.remove('lightbox-hidden');
            lightbox.classList.add('lightbox-visible');
            document.body.style.overflow = 'hidden'; 
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('lightbox-visible');
            lightbox.classList.add('lightbox-hidden');
            document.body.style.overflow = 'auto';
        });
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { 
                lightbox.classList.remove('lightbox-visible');
                lightbox.classList.add('lightbox-hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }

    const nav = document.getElementById('navbar');
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > nav.offsetHeight) {
            nav.style.top = `-${nav.offsetHeight}px`; 
        } else {
            nav.style.top = "0";
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    }, false);
});
