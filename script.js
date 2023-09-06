
function data() {
    return {
        suggestedCities: [],
        step: 1,
        maxStep: 11,
        alert: false,
        situation: '',
        age: '',
        postalCode: '',
        city: '',
        activity: '',
        netIncome: '',
        propertyIncome: '',
        otherIncome: '',
        monthlyCharges: '',
        firstName: '',
        lastName: '',
        email: '',
        amountAnnualBenefice: '',
        amountAnnualTaxes: '',
        // fonction validation
        validateForm() {
            if (this.step === 1 && !this.situation) {
                    this.alert = true;
                    return;
                }
                if (this.step === 2 && (this.age < 18 || !this.age)) {
                    this.alert = true;
                    alert('Vous devez avoir au moins 18 ans pour continuer.');
                    return;
                }
                
                if (this.step === 3 && (this.postalCode.length !== 5 || !this.postalCode)) {
                    this.alert = true;
                    alert('Le code postal doit comporter exactement 5 chiffres.');
                    return;
                }
                
                if (this.step === 4 && !this.activity) {
                    this.alert = true;
                    return;
                }
                if (this.step === 5 && !this.netIncome) {
                    this.alert = true;
                    return;
                }
                if (this.step === 6 && !this.propertyIncome && this.propertyIncome !== 0) {
                    this.alert = true;
                    return;
                }
                if (this.step === 7 && !this.otherIncome && this.otherIncome !== 0) {
                    this.alert = true;
                    return;
                }
                if (this.step === 8 && !this.monthlyCharges) {
                    this.alert = true;
                    return;
                }
                if (this.step === 9 && (!this.firstName || !this.lastName)) {
                    this.alert = true;
                    return;
                }
                if (this.step === 10 && (!this.email || !document.getElementById('flexCheckDefault').checked)) {
                    this.alert = true;
                    alert('Veuillez accepter les conditions de confidentialité pour continuer.');
                    return;
                }                

                if (this.step === 11) {
                    
                    myUniqueGraphDonutFunction();
                    sendEmail(formData);
                }

                 if (this.step < this.maxStep) {
                    this.step++;
                    this.alert = false;
                }
            // Stockage des données en local
            const formData = {
                situation: this.situation,
                age: this.age,
                postalCode: this.postalCode,
                city: this.city,
                activity: this.activity,
                netIncome: this.netIncome,
                propertyIncome: this.propertyIncome,
                otherIncome: this.otherIncome,
                monthlyCharges: this.monthlyCharges,
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                amountAnnualBenefice: this.amountAnnualBenefice,
                amountAnnualTaxes: this.amountAnnualTaxes
            };
            localStorage.setItem('formData', JSON.stringify(formData));

        },
        // Toutes vos autres fonctions et données AlpineJS ici
        previousStep() {
            if (this.step > 1) {
                this.step--;
                this.alert = false;
            }
        },
        fetchCity() {
            if (this.postalCode.length >= 5) {
                fetch(`http://localhost:8080/https://api-adresse.data.gouv.fr/search/?q=${this.postalCode}&type=municipality&limit=5`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.features && data.features.length > 0) {
                            this.suggestedCities = data.features.map(feature => ({
                                label: feature.properties.label,
                                postalCode: feature.properties.postcode
                            }));
                        } else {
                            this.suggestedCities = [];
                        }
                    })
                    .catch(error => {
                        console.error("Erreur lors de la récupération des villes :", error);
                        this.suggestedCities = [];
                    });
            } else {
                this.suggestedCities = [];
            }
        },
        selectCity(city) {
            this.postalCode = city.postalCode;
            this.suggestedCities = [];
        }
    }
}
function storeDataLocally(data) {
    localStorage.setItem('infos', JSON.stringify(data));
}

function myUniqueGraphDonutFunction() {
   
     var locInfos = localStorage.getItem('formData');
     console.log(localStorage.getItem('formData'));
    
     if (!locInfos) {
        console.error("Aucune donnée trouvée dans le localStorage sous la clé 'infos'.");
        return;
    }
        locInfos =  JSON.parse(locInfos);
        console.log(locInfos);

        var capaciteEp;
        var resultatRetraite;
      
        if (locInfos.activity === "Indépendant/Chef d entreprise") {
            capaciteEp = (parseInt(locInfos.amountAnnualBenefice, 10) / 12) + 
                         (parseInt(locInfos.propertyIncome || 0, 10) + 
                          parseInt(locInfos.otherIncome || 0, 10)) - 
                         parseInt(locInfos.monthlyCharges, 10) - 
                         (parseInt(locInfos.amountAnnualTaxes, 10) / 12);
            resultatRetraite = parseInt(parseInt(locInfos.amountAnnualBenefice, 10) / 12 * 30 / 100, 10);
        } else {
            capaciteEp = parseInt(locInfos.netIncome, 10) + 
                         parseInt(locInfos.propertyIncome || 0, 10) + 
                         parseInt(locInfos.otherIncome || 0, 10) - 
                         parseInt(locInfos.monthlyCharges, 10);
            resultatRetraite = parseInt(parseInt(locInfos.netIncome, 10) * 60 / 100, 10);
        }
      
        capaciteEp = parseInt(capaciteEp, 10);
        resultatRetraite = parseInt(resultatRetraite, 10);
      
        // Attribution des pourcentages
        var tLiquidite, tRetraite, tAssuranceVie, tImmoLocatif;
        if (capaciteEp < 100) {
          tLiquidite = 100;
          tRetraite = 0;
          tAssuranceVie = 0;
          tImmoLocatif = 0;
        } else if (capaciteEp > 100 && capaciteEp <= 350) {
          tLiquidite = 33.30;
          tRetraite = 66.70;
          tAssuranceVie = 0;
          tImmoLocatif = 0;
        } else if (capaciteEp > 350) {
          tLiquidite = 15;
          tRetraite = 30;
          tAssuranceVie = 40;
          tImmoLocatif = 15;
        }
      
        var donutG = [tLiquidite, tAssuranceVie, tRetraite, tImmoLocatif];
      
        let liquidite = $('.liquidite-val');
        let retraite = $('.retraite-val');
        let assurance = $('.assurance-val');
        let immobilier = $('.immobilier-val');
        let total = $('.total-value');
        let capacite = $('.capacite-result');
        let pension = $('.pension-result');
      
        liquidite.text(parseInt(tLiquidite * capaciteEp / 100)+"€");
        retraite.text(parseInt(tRetraite * capaciteEp / 100)+"€");
        assurance.text(parseInt(tAssuranceVie * capaciteEp / 100)+"€");
        immobilier.text(parseInt(tImmoLocatif * capaciteEp / 100)+"€");
        total.text(capaciteEp+"€");
        capacite.text(capaciteEp+"€");
        pension.text(resultatRetraite+"€");
      
        liquidite.text(liquidite.text().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        retraite.text(retraite.text().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        assurance.text(assurance.text().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        immobilier.text(immobilier.text().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        total.text(total.text().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        capacite.text(capacite.text().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        pension.text(pension.text().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
      
        var camembertResults = {
          values: donutG,
          colors: ['#F4FA9C', '#BA53DE', '#F469A9', '#88BEF5'],
          animation: true,
          animationSpeed: 1,
          fillTextData: true,
          fillTextColor: '#38478E',
          fillTextAlign: 2.2,
          fillTextPosition: 'inner',
          doughnutHoleSize: 70,
          doughnutHoleColor: '#fff',
          offset: 1,
          pie: 'normal',
          isStrokePie: {
            stroke: 20,
            overlayStroke: true,
            overlayStrokeColor: '#38478E',
            strokeStartEndPoints: 'Yes',
            strokeAnimation: true,
            strokeAnimationSpeed: 1,
            fontSize: '11px',
            textAlignement: 'center',
            fontFamily: 'Montserrat',
            fontWeight: '600'
          }
        };

        function generatePieGraph(canvasId, data) {
            var ctx = document.getElementById(canvasId).getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: data.values,
                        backgroundColor: data.colors
                    }]
                }
            });
        }
      
        generatePieGraph('myCanvas', camembertResults);
}

$(document).ready(function() {
    myUniqueGraphDonutFunction();
});


function formatFormData(formData) {
    return `
Nom: ${formData.firstName} ${formData.lastName}
Âge: ${formData.age}
Code postal: ${formData.postalCode}
Ville: ${formData.city}
Situation: ${formData.situation}
Activité: ${formData.activity}
Revenu net: ${formData.netIncome}€
Revenu immobilier: ${formData.propertyIncome}€
Autres revenus: ${formData.otherIncome}€
Charges mensuelles: ${formData.monthlyCharges}€
Bénéfice annuel (si indépendant): ${formData.amountAnnualBenefice}€
Taxes annuelles (si indépendant): ${formData.amountAnnualTaxes}€
Email: ${formData.email}
    `;
}


const BACKEND_URL = 'URL_HEROKU_APP'; // Remplacez par l'URL de votre backend sur Heroku

async function sendEmail(formData) {
    const formattedData = formatFormData(formData);
    
    const emailContent = `
Les détails du formulaire sont les suivants:

${formattedData}

Tableau:
Liquidité: ${formData.liquidite}€
Retraite: ${formData.retraite}€
Assurance vie: ${formData.assurance}€
Immobilier Locatif: ${formData.immobilier}€
Total: ${formData.total}€
`;

    try {
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: "nassim.tabari@gmail.com",
                subject: "Nouvelle soumission de formulaire",
                text: emailContent
            })
        });

        if (response.status === 200) {
            console.log('Email envoyé avec succès');
        } else {
            console.error('Erreur lors de l\'envoi de l\'email');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
    
}

module.exports = {
    data
};
