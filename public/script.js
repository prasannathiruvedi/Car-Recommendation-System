document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = (document.querySelector('meta[name="api-base"]')?.getAttribute('content')) || '';
    const form = document.getElementById('carSearchForm');
    const resultsSection = document.getElementById('resultsSection');
    const carsGrid = document.getElementById('carsGrid');
    const loading = document.getElementById('loading');
    const resultsCount = document.getElementById('resultsCount');
    const budgetRange = document.getElementById('budgetRange');
    const budgetDisplay = document.getElementById('budgetDisplay');
    const budgetInput = document.getElementById('budget');

    // Budget range configuration
    const budgetRanges = [
        { value: 0, label: '₹5 Lakh', max: 500000 },
        { value: 1, label: '₹7 Lakh', max: 700000 },
        { value: 2, label: '₹10 Lakh', max: 1000000 },
        { value: 3, label: '₹15 Lakh', max: 1500000 },
        { value: 4, label: '₹20 Lakh', max: 2000000 },
        { value: 5, label: '₹25 Lakh', max: 2500000 },
        { value: 6, label: '₹30 Lakh+', max: 3000000 },
        { value: 7, label: 'Any Price', max: null }
    ];

    // Initialize budget range
    function initializeBudgetRange() {
        const currentValue = parseInt(budgetRange.value);
        const currentRange = budgetRanges[currentValue];
        budgetDisplay.textContent = currentRange.label;
        budgetInput.value = currentRange.max;
        updatePresetButtons(currentValue);
    }

    // Handle budget range change
    budgetRange.addEventListener('input', function() {
        const value = parseInt(this.value);
        const range = budgetRanges[value];
        budgetDisplay.textContent = range.label;
        budgetInput.value = range.max;
        updatePresetButtons(value);
    });

    // Handle budget preset buttons
    function updatePresetButtons(activeIndex) {
        const presetButtons = document.querySelectorAll('.preset');
        presetButtons.forEach((button, index) => {
            const buttonIndex = parseInt(button.dataset.range);
            if (buttonIndex === activeIndex) {
                button.classList.add('!bg-teal-400', '!text-carbon-900', 'font-bold');
                button.classList.remove('muted');
            } else {
                button.classList.remove('!bg-teal-400', '!text-carbon-900', 'font-bold');
                button.classList.add('muted');
            }
        });
    }

    // Add click handlers for preset buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('preset')) {
            const rangeIndex = parseInt(e.target.dataset.range);
            budgetRange.value = rangeIndex;
            const range = budgetRanges[rangeIndex];
            budgetDisplay.textContent = range.label;
            budgetInput.value = range.max;
            updatePresetButtons(rangeIndex);
        }
    });

    // Load filter options when page loads
    loadFilterOptions();
    initializeBudgetRange();

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        searchCars();
    });

    // Load filter options from API
    async function loadFilterOptions() {
        try {
            const response = await fetch(`${API_BASE}/api/filters`);
            const filters = await response.json();
            
            populateSelect('fuelType', filters.fuelTypes);
            populateSelect('bodyType', filters.bodyTypes);
            populateSelect('transmission', filters.transmissions);
            populateSelect('brand', filters.brands);
        } catch (error) {
            console.error('Error loading filter options:', error);
        }
    }

    // Populate select options
    function populateSelect(selectId, options) {
        const select = document.getElementById(selectId);
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }

    // Search for cars
    async function searchCars() {
        const formData = new FormData(form);
        const budgetValue = formData.get('budget');
        const currentRangeIndex = parseInt(budgetRange.value);
        const currentRange = budgetRanges[currentRangeIndex];
        
        const searchParams = {
            budget: budgetValue || null,
            fuelType: formData.get('fuelType'),
            bodyType: formData.get('bodyType'),
            transmission: formData.get('transmission'),
            brand: formData.get('brand'),
            minYear: formData.get('minYear') || null
        };

        // Show loading
        loading.classList.remove('hidden');
        loading.classList.add('block');
        resultsSection.classList.add('hidden');
        resultsSection.classList.remove('block');

        try {
            const response = await fetch(`${API_BASE}/api/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams)
            });

            const cars = await response.json();
            displayResults(cars);
        } catch (error) {
            console.error('Error searching cars:', error);
            displayError();
        } finally {
            loading.classList.add('hidden');
            loading.classList.remove('block');
        }
    }

    // Display search results
    function displayResults(cars) {
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('block');
        resultsCount.textContent = cars.length;
        
        if (cars.length === 0) {
            displayNoResults();
            return;
        }

        carsGrid.innerHTML = '';
        cars.forEach(car => {
            const carCard = createCarCard(car);
            carsGrid.appendChild(carCard);
        });
    }

    // Create car card element
    // Create car card element
    function createCarCard(car) {
        console.log('Creating car card for:', car.make, car.model); // Debug log
        const card = document.createElement('article');
        card.className = 'result-card p-6 rounded-xl';
        
        // Format price with commas and lakh/crore format
        const price = car.price ? formatPrice(car.price) : 'Price not available';
        
        // Get key features
        const features = [];
        if (car.power) features.push(`Power: ${car.power}`);
        if (car.torque) features.push(`Torque: ${car.torque}`);
        if (car.seating_capacity) features.push(`Seating: ${car.seating_capacity}`);
        if (car.fuel_tank_capacity) features.push(`Fuel Tank: ${car.fuel_tank_capacity}`);
        if (car.boot_space) features.push(`Boot Space: ${car.boot_space}`);
        
        const featuresText = features.join(' • ');
        
        card.innerHTML = `
            <div class="flex flex-col gap-4">
                <div class="w-full h-52 md:h-64 rounded-xl overflow-hidden border border-teal-500/20 shadow-md">
                    <img src="${car.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'}"
                       alt="${car.make} ${car.model}"
                       class="w-full h-full object-cover transition-transform duration-500 hover:scale-105 rounded-xl"
                       onerror="this.src='https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'">
                </div>

                <div class="flex flex-col gap-3">
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="font-semibold text-2xl leading-snug">${car.make} ${car.model}</div>
                            <div class="muted text-sm mt-0.5">${car.variant || car.body_type || 'Premium Vehicle'}</div>
                        </div>
                        <div class="text-right flex-shrink-0">
                            <div class="text-teal-400 font-extrabold text-2xl">${price}</div>
                            <div class="muted text-xs mt-0.5">${car.created_at ? new Date(car.created_at).getFullYear() : '2024'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                    <div class="flex items-center text-sm">
                        <span class="text-teal-400 mr-2">⛽</span>
                        <span class="muted">${car.fuel_type || 'N/A'}</span>
                    </div>
                    <div class="flex items-center text-sm">
                        <span class="text-teal-400 mr-2">🚗</span>
                        <span class="muted">${car.body_type || 'N/A'}</span>
                    </div>
                    <div class="flex items-center text-sm">
                        <span class="text-teal-400 mr-2">⚙️</span>
                        <span class="muted">${car.transmission || 'N/A'}</span>
                    </div>
                    <div class="flex items-center text-sm">
                        <span class="text-teal-400 mr-2">👥</span>
                        <span class="muted">${car.seating_capacity || 'N/A'} seats</span>
                    </div>
                    ${car.engine_capacity ? `
                    <div class="flex items-center text-sm">
                        <span class="text-teal-400 mr-2">🔧</span>
                        <span class="muted">${car.engine_capacity}</span>
                    </div>
                    ` : ''}
                    ${car.mileage ? `
                    <div class="flex items-center text-sm">
                        <span class="text-teal-400 mr-2">🛣️</span>
                        <span class="muted">${car.mileage} km/l</span>
                    </div>
                    ` : ''}
                </div>
                
                ${featuresText ? `
                <div class="bg-carbon-700 p-3 rounded-lg border border-white/5">
                    <h4 class="text-sm font-semibold text-teal-400 mb-2">Key Specifications</h4>
                    <p class="text-sm muted">${featuresText}</p>
                </div>
                ` : ''}
                
                ${car.features ? `
                <div class="bg-carbon-700 p-3 rounded-lg border border-white/5">
                    <h4 class="text-sm font-semibold text-teal-400 mb-2">Features</h4>
                    <p class="text-sm muted">${car.features}</p>
                </div>
                ` : ''}
            </div>
        `;
        
        return card;
    }

    // Display no results message
    function displayNoResults() {
        carsGrid.innerHTML = `
            <div class="p-6 glass rounded-xl text-center muted">
                <div class="text-4xl mb-4">🔍</div>
                <h3 class="text-xl font-bold mb-2">No cars found</h3>
                <p class="text-sm">Try adjusting your search criteria to find more options.</p>
            </div>
        `;
    }

    // Display error message
    function displayError() {
        carsGrid.innerHTML = `
            <div class="p-6 glass rounded-xl text-center muted">
                <div class="text-4xl mb-4">⚠️</div>
                <h3 class="text-xl font-bold mb-2">Error occurred</h3>
                <p class="text-sm">Sorry, there was an error searching for cars. Please try again.</p>
            </div>
        `;
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('block');
        resultsCount.textContent = '0';
    }

    // Format price with commas and lakh/crore format
    function formatPrice(amount) {
        if (amount >= 10000000) { // 1 crore or more
            const crores = (amount / 10000000).toFixed(1);
            return `₹${crores} Cr`;
        } else if (amount >= 100000) { // 1 lakh or more
            const lakhs = (amount / 100000).toFixed(1);
            return `₹${lakhs} L`;
        } else {
            return `₹${amount.toLocaleString()}`;
        }
    }
});
