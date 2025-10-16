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
        { value: 6, label: '₹30 Lakh+', max: null }
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
        const presetButtons = document.querySelectorAll('.budget-preset');
        presetButtons.forEach((button, index) => {
            if (index === activeIndex) {
                button.classList.add('bg-blue-500', 'text-white');
                button.classList.remove('bg-blue-100', 'text-blue-600');
            } else {
                button.classList.remove('bg-blue-500', 'text-white');
                button.classList.add('bg-blue-100', 'text-blue-600');
            }
        });
    }

    // Add click handlers for preset buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('budget-preset')) {
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
    function createCarCard(car) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100';
        
        // Format price
        const price = car.price ? `₹${car.price.toLocaleString()}` : 'Price not available';
        
        // Get key features
        const features = [];
        if (car.power) features.push(`Power: ${car.power}`);
        if (car.torque) features.push(`Torque: ${car.torque}`);
        if (car.seating_capacity) features.push(`Seating: ${car.seating_capacity}`);
        if (car.fuel_tank_capacity) features.push(`Fuel Tank: ${car.fuel_tank_capacity}`);
        if (car.boot_space) features.push(`Boot Space: ${car.boot_space}`);
        
        const featuresText = features.join(' • ');
        
        card.innerHTML = `
            <img src="${car.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'}" 
                 alt="${car.make} ${car.model}" 
                 class="w-full h-48 object-cover"
                 onerror="this.src='https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'">
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-1">${car.make} ${car.model}</h3>
                ${car.variant ? `<h4 class="text-sm text-gray-600 mb-3 italic">${car.variant}</h4>` : ''}
                <div class="text-2xl font-bold text-blue-600 mb-4">${price}</div>
                <div class="grid grid-cols-2 gap-3 mb-4">
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-gas-pump text-blue-500 mr-2"></i>
                        <span>${car.fuel_type || 'N/A'}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-car text-blue-500 mr-2"></i>
                        <span>${car.body_type || 'N/A'}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-cog text-blue-500 mr-2"></i>
                        <span>${car.transmission || 'N/A'}</span>
                    </div>
                    ${car.engine_capacity ? `
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-tachometer-alt text-blue-500 mr-2"></i>
                        <span>${car.engine_capacity}</span>
                    </div>
                    ` : ''}
                    ${car.mileage ? `
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-road text-blue-500 mr-2"></i>
                        <span>${car.mileage} km/l</span>
                    </div>
                    ` : ''}
                </div>
                ${featuresText ? `
                <div class="bg-gray-50 p-3 rounded-lg mb-3">
                    <h4 class="text-sm font-semibold text-gray-700 mb-1">Key Specifications</h4>
                    <p class="text-sm text-gray-600">${featuresText}</p>
                </div>
                ` : ''}
                ${car.features ? `
                <div class="bg-blue-50 p-3 rounded-lg">
                    <h4 class="text-sm font-semibold text-blue-700 mb-1">Features</h4>
                    <p class="text-sm text-blue-600">${car.features}</p>
                </div>
                ` : ''}
            </div>
        `;
        
        return card;
    }

    // Display no results message
    function displayNoResults() {
        carsGrid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-700 mb-2">No cars found</h3>
                <p class="text-lg text-gray-500">Try adjusting your search criteria to find more options.</p>
            </div>
        `;
    }

    // Display error message
    function displayError() {
        carsGrid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-700 mb-2">Error occurred</h3>
                <p class="text-lg text-gray-500">Sorry, there was an error searching for cars. Please try again.</p>
            </div>
        `;
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('block');
        resultsCount.textContent = '0';
    }

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
});
