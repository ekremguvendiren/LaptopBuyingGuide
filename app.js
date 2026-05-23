// ============================================================
// Laptop Buying Guide — Rule-Based Expert System
// University AI Course Project
// ============================================================
const EUR_TO_GBP = 0.845;

// ============================================================
// KNOWLEDGE BASE (30 laptops)
// ============================================================
const KNOWLEDGE_BASE = [
  // ── BUDGET / STUDENT ──────────────────────────────────────
  {
    id: 'asus-vivobook-15',
    name: 'ASUS VivoBook 15 (2024)',
    brand: 'ASUS', badge: 'Entry Budget', badgeColor: 'emerald',
    priceEUR: 449, valueScore: 8.1,
    image: '/public/laptops/asus-vivobook-15.jpg',
    brandFallbackImage: '/public/laptops/asus-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-student.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core i3-1215U (6C, 4.4GHz)', gpu: 'Intel UHD Graphics (Integrated)',
      ram: 8, ramDisplay: '8GB DDR4', storage: '256GB NVMe SSD',
      display: '15.6" FHD IPS 60Hz', weight: 1.80, weightDisplay: '1.80 kg',
      battery: '42Wh (~7h)', batteryHours: 7, os: 'windows',
      refreshRate: 60, upgradeableRam: true, buildQuality: 'plastic',
    },
    hasGpu: false,
    purpose: ['student', 'office'],
    portability: ['desk', 'balanced'],
    bestFor: ['Very tight budget', 'Basic student tasks', 'Web browsing and documents'],
    notFor: ['Gaming', 'Video editing', 'Virtual machines', 'Heavy multitasking'],
    pros: ['Cheapest option available', 'Upgradeable RAM', 'Lightweight for the price', 'Reliable for basics'],
    cons: ['Only 256GB storage', 'Weak CPU for multitasking', 'No dedicated GPU', '60Hz only'],
    expertNotes: 'The ideal first laptop for students who need web, email, and documents without breaking the bank.',
    userFeedback: 'Users praise the price but note the 256GB fills up quickly. Great for light daily use.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=ASUS+VivoBook+15+Intel+i3+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=ASUS+VivoBook+15+Intel+i3&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=ASUS+VivoBook+15+i3',
    },
  },
  {
    id: 'acer-aspire-5',
    name: 'Acer Aspire 5 (2024)',
    brand: 'Acer', badge: 'Best Value Budget', badgeColor: 'emerald',
    priceEUR: 479, valueScore: 8.3,
    image: '/public/laptops/acer-laptop.jpg',
    brandFallbackImage: '/public/laptops/acer-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-student.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen 5 7530U (6C/12T, 4.5GHz)', gpu: 'AMD Radeon Graphics (Integrated)',
      ram: 8, ramDisplay: '8GB DDR4', storage: '512GB NVMe SSD',
      display: '15.6" FHD IPS 60Hz', weight: 1.77, weightDisplay: '1.77 kg',
      battery: '50Wh (~8h)', batteryHours: 8, os: 'windows',
      refreshRate: 60, upgradeableRam: true, buildQuality: 'plastic',
    },
    hasGpu: false,
    purpose: ['student', 'office'],
    portability: ['desk', 'balanced'],
    bestFor: ['Budget students', 'Documents and email', 'Light coding intro', 'First laptop'],
    notFor: ['Gaming', 'Video editing', 'VMs', 'Professional use'],
    pros: ['512GB storage', 'Ryzen 5 solid performance', 'Upgradeable RAM', '8h battery', 'Low price'],
    cons: ['Plastic build', 'No GPU', '60Hz display', 'Average webcam'],
    expertNotes: 'The Ryzen 5 7530U delivers punchy everyday performance well above i3 alternatives at nearly the same price.',
    userFeedback: 'Consistently rated best budget pick. Users love the storage and battery combo at this price point.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Acer+Aspire+5+Ryzen+5+7530U+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=Acer+Aspire+5+Ryzen+5+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Acer+Aspire+5+Ryzen+5+2024',
    },
  },
  {
    id: 'dell-inspiron-15',
    name: 'Dell Inspiron 15 (2024)',
    brand: 'Dell', badge: 'Reliable Budget', badgeColor: 'emerald',
    priceEUR: 499, valueScore: 8.0,
    image: '/public/laptops/dell-inspiron-15.jpg',
    brandFallbackImage: '/public/laptops/dell-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-student.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core i5-1335U (10C, 4.6GHz)', gpu: 'Intel Iris Xe (Integrated)',
      ram: 8, ramDisplay: '8GB DDR4', storage: '512GB NVMe SSD',
      display: '15.6" FHD IPS 120Hz', weight: 1.80, weightDisplay: '1.80 kg',
      battery: '54Wh (~8h)', batteryHours: 8, os: 'windows',
      refreshRate: 120, upgradeableRam: true, buildQuality: 'plastic',
    },
    hasGpu: false,
    purpose: ['student', 'office'],
    portability: ['desk', 'balanced'],
    bestFor: ['Students needing reliability', 'Dell build reputation', '120Hz smooth display', 'Everyday office'],
    notFor: ['Gaming', 'Video editing', 'Heavy programming'],
    pros: ['120Hz display at this price', 'Dell reliability', '512GB SSD', 'Upgradeable RAM', 'Good CPU'],
    cons: ['Plastic chassis', 'No GPU', 'Average battery', 'Heavy at 1.8kg'],
    expertNotes: 'The 120Hz IPS panel at €499 is unusual — makes scrolling and video notably smoother than 60Hz alternatives.',
    userFeedback: 'Users highlight the smooth display and Dell support quality. Battery life is adequate for classes.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Dell+Inspiron+15+i5-1335U+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=Dell+Inspiron+15+Core+i5+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Dell+Inspiron+15+i5+2024',
    },
  },
  {
    id: 'hp-pavilion-15',
    name: 'HP Pavilion 15 (2024)',
    brand: 'HP', badge: 'Student Favourite', badgeColor: 'blue',
    priceEUR: 529, valueScore: 8.2,
    image: '/public/laptops/hp-pavilion-15.jpg',
    brandFallbackImage: '/public/laptops/hp-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-student.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen 5 7530U (6C/12T, 4.5GHz)', gpu: 'AMD Radeon Graphics (Integrated)',
      ram: 8, ramDisplay: '8GB DDR4', storage: '512GB NVMe SSD',
      display: '15.6" FHD IPS 60Hz', weight: 1.75, weightDisplay: '1.75 kg',
      battery: '41Wh (~7h)', batteryHours: 7, os: 'windows',
      refreshRate: 60, upgradeableRam: true, buildQuality: 'plastic',
    },
    hasGpu: false,
    purpose: ['student', 'office'],
    portability: ['desk', 'balanced'],
    bestFor: ['Student budget', 'HP brand preference', 'Documents and media', 'Light tasks'],
    notFor: ['Gaming', 'Content creation', 'VMs', 'Travel (battery short)'],
    pros: ['HP trusted brand', 'Ryzen 5 performance', '512GB storage', 'Slim for class', 'Upgradeable'],
    cons: ['Short 7h battery', 'Plastic only', '60Hz panel', 'No GPU'],
    expertNotes: 'HP Pavilion targets students who want brand reliability on a budget. The Ryzen 5 handles multitasking better than i3 equivalents.',
    userFeedback: 'Popular among students. Battery life is the main complaint for longer days.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=HP+Pavilion+15+Ryzen+5+7530U+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=HP+Pavilion+15+AMD+Ryzen+5+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=HP+Pavilion+15+Ryzen+5',
    },
  },
  {
    id: 'lenovo-ideapad-slim3',
    name: 'Lenovo IdeaPad Slim 3 15 AMD',
    brand: 'Lenovo', badge: 'Best Budget Pick', badgeColor: 'emerald',
    priceEUR: 549, valueScore: 8.8,
    image: '/public/laptops/lenovo-ideapad-slim3.jpg',
    brandFallbackImage: '/public/laptops/lenovo-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-student.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen 5 7520U (4C/8T, 4.5GHz)', gpu: 'AMD Radeon 610M (Integrated)',
      ram: 8, ramDisplay: '8GB LPDDR5', storage: '512GB NVMe SSD',
      display: '15.6" FHD IPS 60Hz', weight: 1.65, weightDisplay: '1.65 kg',
      battery: '47Wh (~8h)', batteryHours: 8, os: 'windows',
      refreshRate: 60, upgradeableRam: true, buildQuality: 'plastic',
    },
    hasGpu: false,
    purpose: ['student', 'office'],
    portability: ['desk', 'balanced'],
    bestFor: ['Basic web browsing', 'Documents and spreadsheets', 'Email and video calls', 'Students on tight budgets'],
    notFor: ['Gaming', 'Video editing', 'Running VMs', 'Heavy multitasking'],
    pros: ['Lowest price in lineup', 'Upgradeable RAM', 'Decent 8h battery', '1.65kg lightweight', 'Reliable AMD Ryzen'],
    cons: ['Only 8GB RAM base', 'Plastic build', '60Hz only', 'No dedicated GPU'],
    expertNotes: 'Ryzen 5 7520U handles everyday computing without bottlenecks. The RAM upgrade path gives future longevity.',
    userFeedback: 'Users praise value-for-money and battery. Common complaint is limited RAM for multitasking.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Lenovo+IdeaPad+Slim+3+15+AMD+Ryzen+5+7520U&i=computers',
      amazones: 'https://www.amazon.es/s?k=Lenovo+IdeaPad+Slim+3+AMD+Ryzen+5&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Lenovo+IdeaPad+Slim+3+15+AMD',
    },
  },
  // ── PROGRAMMING / BUSINESS ───────────────────────────────
  {
    id: 'asus-vivobook-16x',
    name: 'ASUS VivoBook 16X (2024)',
    brand: 'ASUS', badge: 'Smart Mid-Budget', badgeColor: 'blue',
    priceEUR: 699, valueScore: 8.5,
    image: '/public/laptops/asus-vivobook-16x.jpg',
    brandFallbackImage: '/public/laptops/asus-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-programming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen 7 7730U (8C/16T, 4.5GHz)', gpu: 'AMD Radeon 780M (Integrated)',
      ram: 16, ramDisplay: '16GB DDR4', storage: '512GB NVMe SSD',
      display: '16" WUXGA IPS 60Hz', weight: 1.88, weightDisplay: '1.88 kg',
      battery: '50Wh (~9h)', batteryHours: 9, os: 'windows',
      refreshRate: 60, upgradeableRam: true, buildQuality: 'plastic',
    },
    hasGpu: false,
    purpose: ['student', 'office', 'programming'],
    portability: ['desk', 'balanced'],
    bestFor: ['Programming and development', 'Office multitasking', 'Students needing 16GB RAM', 'Budget-conscious developers'],
    notFor: ['Serious gaming', 'Professional video editing', 'Frequent travel'],
    pros: ['16GB RAM standard', '8-core Ryzen 7', 'Large 16" display', 'Upgradeable storage'],
    cons: ['60Hz only', 'Heavy at 1.88kg', 'Plastic build', 'No dedicated GPU'],
    expertNotes: 'Ryzen 7 7730U with 16GB DDR4 hits the sweet spot for student developers. Multiple IDE instances run smoothly.',
    userFeedback: 'Developers appreciate the 16GB RAM and Ryzen 7. Fan can be audible under sustained loads.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=ASUS+VivoBook+16X+K3605+Ryzen+7+7730U&i=computers',
      amazones: 'https://www.amazon.es/s?k=ASUS+VivoBook+16X+AMD+Ryzen+7&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=ASUS+VivoBook+16X+AMD+Ryzen+7',
    },
  },
  {
    id: 'framework-laptop-13',
    name: 'Framework Laptop 13 (AMD)',
    brand: 'Framework', badge: 'Most Upgradeable', badgeColor: 'emerald',
    priceEUR: 849, valueScore: 8.6,
    image: '/public/laptops/framework-laptop-13.jpg',
    brandFallbackImage: '/public/laptops/framework-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-programming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen 7 7840U (8C/16T, 5.1GHz)', gpu: 'AMD Radeon 780M (Integrated)',
      ram: 16, ramDisplay: '16GB DDR5', storage: '512GB NVMe SSD',
      display: '13.5" 2256×1504 IPS 60Hz', weight: 1.31, weightDisplay: '1.31 kg',
      battery: '61Wh (~10h)', batteryHours: 10, os: 'windows',
      refreshRate: 60, upgradeableRam: true, buildQuality: 'aluminum',
    },
    hasGpu: false,
    purpose: ['programming', 'student', 'office'],
    portability: ['travel', 'balanced'],
    bestFor: ['Linux users', 'Right-to-repair advocates', 'Upgradeable everything', 'Developers wanting longevity', 'Cybersecurity tinkerers'],
    notFor: ['Gaming', 'Video editing', 'Budget shoppers'],
    pros: ['Every component replaceable/upgradeable', 'Excellent Linux support', 'Premium aluminum build', 'Compact 1.31kg', 'Modular ports'],
    cons: ['Premium price for specs', 'Small 13.5" display', '60Hz only', 'No dedicated GPU'],
    expertNotes: 'The Framework 13 is the only laptop where you can replace the keyboard, battery, ports, and mainboard individually — built for 10+ year lifespan.',
    userFeedback: 'Linux users rate Framework highest for driver compatibility. Modular design is praised as future-proof.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Framework+Laptop+13+AMD+Ryzen+7&i=computers',
      amazones: 'https://www.amazon.es/s?k=Framework+Laptop+13+AMD&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Framework+Laptop+13+AMD',
    },
  },
  {
    id: 'lenovo-thinkpad-e16',
    name: 'Lenovo ThinkPad E16 Gen 2',
    brand: 'Lenovo', badge: "Developer's Choice", badgeColor: 'purple',
    priceEUR: 949, valueScore: 8.7,
    image: '/public/laptops/lenovo-thinkpad-e16.jpg',
    brandFallbackImage: '/public/laptops/lenovo-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-programming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen 7 7735HS (8C/16T, 4.75GHz)', gpu: 'AMD Radeon 680M (Integrated)',
      ram: 16, ramDisplay: '16GB DDR5', storage: '512GB NVMe SSD',
      display: '16" WUXGA IPS 60Hz Anti-Glare', weight: 1.89, weightDisplay: '1.89 kg',
      battery: '57Wh (~12h)', batteryHours: 12, os: 'windows',
      refreshRate: 60, upgradeableRam: true, buildQuality: 'military-grade',
    },
    hasGpu: false,
    purpose: ['programming', 'office', 'business'],
    portability: ['desk', 'balanced'],
    bestFor: ['Professional developers', 'Linux users', 'Long workdays', 'Business travel', 'Keyboard-heavy workflows'],
    notFor: ['Gaming', '3D rendering', 'Ultra-portable needs'],
    pros: ['Legendary ThinkPad keyboard', 'MIL-SPEC 810H durability', 'Excellent Linux compatibility', '12h battery', 'Upgradeable RAM'],
    cons: ['No dedicated GPU', '1.89kg', '60Hz only'],
    expertNotes: 'ThinkPads have the best keyboards in the industry — critical for programmers typing 8+ hours daily.',
    userFeedback: 'Developers rate the keyboard and Linux compatibility highest. Battery life exceeds expectations.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Lenovo+ThinkPad+E16+Gen+2+AMD+Ryzen+7+7735HS&i=computers',
      amazones: 'https://www.amazon.es/s?k=Lenovo+ThinkPad+E16+Gen+2+AMD&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Lenovo+ThinkPad+E16+Gen+2+AMD',
    },
  },
  // ── ULTRABOOKS / TRAVEL ───────────────────────────────────
  {
    id: 'asus-zenbook-14-oled',
    name: 'ASUS Zenbook 14 OLED (2024)',
    brand: 'ASUS', badge: 'OLED Ultrabook', badgeColor: 'cyan',
    priceEUR: 999, valueScore: 9.0,
    image: '/public/laptops/asus-zenbook-14-oled.jpg',
    brandFallbackImage: '/public/laptops/asus-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-premium.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core Ultra 7 155H (16C, 4.8GHz)', gpu: 'Intel Arc Graphics (Integrated)',
      ram: 16, ramDisplay: '16GB LPDDR5x', storage: '1TB NVMe SSD',
      display: '14" 2.8K OLED 90Hz', weight: 1.28, weightDisplay: '1.28 kg',
      battery: '75Wh (~13h)', batteryHours: 13, os: 'windows',
      refreshRate: 90, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: false,
    purpose: ['programming', 'office', 'student', 'content'],
    portability: ['travel', 'balanced'],
    bestFor: ['Frequent travelers', 'OLED display lovers', 'Photo editing', 'All-day battery use'],
    notFor: ['Gaming', 'GPU workloads', 'RAM-intensive VMs (soldered)'],
    pros: ['2.8K OLED display', '13h battery', '1.28kg lightweight', '1TB SSD', 'Aluminum build'],
    cons: ['Soldered RAM', 'Intel Arc limited for gaming', 'Higher price'],
    expertNotes: '2.8K OLED with 16-core CPU in a 1.28kg chassis — a rare combination at this price.',
    userFeedback: 'OLED display and battery life rated 5/5. Users wish RAM were upgradeable.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=ASUS+Zenbook+14+OLED+UX3405+Core+Ultra+7&i=computers',
      amazones: 'https://www.amazon.es/s?k=ASUS+Zenbook+14+OLED+UX3405+Core+Ultra&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=ASUS+Zenbook+14+OLED+UX3405',
    },
  },
  {
    id: 'microsoft-surface-laptop-7',
    name: 'Microsoft Surface Laptop 7',
    brand: 'Microsoft', badge: 'Windows + ARM', badgeColor: 'blue',
    priceEUR: 1199, valueScore: 8.2,
    image: '/public/laptops/microsoft-surface-laptop-7.jpg',
    brandFallbackImage: '/public/laptops/microsoft-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-business.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Snapdragon X Elite X1E-80-100 (12C, 3.4GHz)', gpu: 'Qualcomm Adreno X1 (Integrated)',
      ram: 16, ramDisplay: '16GB LPDDR5x', storage: '512GB NVMe SSD',
      display: '13.8" PixelSense 2256×1504 120Hz', weight: 1.34, weightDisplay: '1.34 kg',
      battery: '54Wh (~20h)', batteryHours: 20, os: 'windows',
      refreshRate: 120, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: false,
    purpose: ['office', 'student', 'business'],
    portability: ['travel', 'balanced'],
    bestFor: ['Maximum battery on Windows', 'Business travelers', 'Microsoft 365 users'],
    notFor: ['Gaming', 'x86-only software', 'CUDA workloads'],
    pros: ['~20h battery life', 'Premium aluminum build', '120Hz display', 'Silent fanless'],
    cons: ['ARM — some x86 apps incompatible', 'No dedicated GPU', 'Soldered RAM'],
    expertNotes: 'Snapdragon X Elite delivers MacBook-competitive battery life on Windows. Most web dev tools support ARM natively.',
    userFeedback: 'Battery life rated 5/5. Some compatibility issues with older x86 apps reported.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Microsoft+Surface+Laptop+7+Snapdragon+X+Elite&i=computers',
      amazones: 'https://www.amazon.es/s?k=Microsoft+Surface+Laptop+7+Snapdragon+X+Elite&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Microsoft+Surface+Laptop+7+Snapdragon',
    },
  },
  // ── APPLE ────────────────────────────────────────────────
  {
    id: 'apple-macbook-air-m3-13',
    name: 'Apple MacBook Air 13" M3',
    brand: 'Apple', badge: 'Best macOS Value', badgeColor: 'slate',
    priceEUR: 1299, valueScore: 9.1,
    image: '/public/laptops/apple-macbook-air-m3-13.jpg',
    brandFallbackImage: '/public/laptops/apple-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-premium.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Apple M3 (8-core CPU, 10-core GPU)', gpu: 'Apple M3 10-core (Integrated)',
      ram: 8, ramDisplay: '8GB Unified Memory', storage: '256GB SSD',
      display: '13.6" Liquid Retina 2560×1664', weight: 1.24, weightDisplay: '1.24 kg',
      battery: '52.6Wh (~18h)', batteryHours: 18, os: 'macos',
      refreshRate: 60, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: false,
    purpose: ['office', 'student', 'programming', 'content'],
    portability: ['travel', 'balanced'],
    bestFor: ['macOS ecosystem users', 'iOS/Swift developers', 'Long battery life', 'Students on macOS'],
    notFor: ['Windows gaming', 'CUDA ML workloads', 'Windows-only software'],
    pros: ['18h real battery', 'Best performance-per-watt', 'Premium aluminum', 'Silent fanless', 'Retina display'],
    cons: ['Only 8GB base RAM', '256GB SSD fills fast', 'RAM not upgradeable', 'macOS only'],
    expertNotes: 'M3 8GB unified memory behaves like 16GB DDR5 due to bandwidth advantage. Still, power users should configure 16GB.',
    userFeedback: 'Battery rated 5/5. Base 8GB/256GB configuration frequently criticised as restrictive.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Apple+MacBook+Air+13+Zoll+M3+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=Apple+MacBook+Air+13+M3+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Apple+MacBook+Air+13+M3+2024',
    },
  },
  {
    id: 'apple-macbook-air-m3-15',
    name: 'Apple MacBook Air 15" M3',
    brand: 'Apple', badge: 'Big Screen Mac', badgeColor: 'slate',
    priceEUR: 1529, valueScore: 8.9,
    image: '/public/laptops/apple-macbook-air-m3-15.jpg',
    brandFallbackImage: '/public/laptops/apple-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-premium.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Apple M3 (8-core CPU, 10-core GPU)', gpu: 'Apple M3 10-core (Integrated)',
      ram: 16, ramDisplay: '16GB Unified Memory', storage: '512GB SSD',
      display: '15.3" Liquid Retina 2880×1864', weight: 1.51, weightDisplay: '1.51 kg',
      battery: '66.5Wh (~18h)', batteryHours: 18, os: 'macos',
      refreshRate: 60, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: false,
    purpose: ['office', 'programming', 'content', 'student'],
    portability: ['balanced', 'desk'],
    bestFor: ['macOS users wanting larger screen', 'Developers needing screen space', 'Light video editing'],
    notFor: ['Gaming', 'CUDA workloads', 'Windows software'],
    pros: ['16GB RAM standard', 'Large 15" Retina', '18h battery', 'Silent fanless', 'Excellent resale value'],
    cons: ['RAM not upgradeable', 'No dedicated GPU', 'macOS only', '60Hz display'],
    expertNotes: 'MBA 15" is the sweet spot for macOS users wanting a spacious display without Pro pricing.',
    userFeedback: 'Screen size and battery praised. Users transitioning from Windows appreciate the build quality.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Apple+MacBook+Air+15+Zoll+M3+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=Apple+MacBook+Air+15+M3+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Apple+MacBook+Air+15+M3+2024',
    },
  },
  // ── GAMING ───────────────────────────────────────────────
  {
    id: 'msi-katana-15',
    name: 'MSI Katana 15 (2024)',
    brand: 'MSI', badge: 'Budget Gaming', badgeColor: 'red',
    priceEUR: 799, valueScore: 8.3,
    image: '/public/laptops/msi-katana-15.jpg',
    brandFallbackImage: '/public/laptops/msi-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-gaming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core i7-13620H (10C, 4.9GHz)', gpu: 'NVIDIA GeForce RTX 4060 8GB',
      ram: 16, ramDisplay: '16GB DDR5', storage: '512GB NVMe SSD',
      display: '15.6" FHD IPS 144Hz', weight: 2.20, weightDisplay: '2.20 kg',
      battery: '53Wh (~5h gaming)', batteryHours: 5, os: 'windows',
      refreshRate: 144, upgradeableRam: true, buildQuality: 'plastic',
    },
    hasGpu: true,
    purpose: ['gaming', 'content'],
    portability: ['desk', 'balanced'],
    bestFor: ['Budget-first gamers', 'RTX 4060 at lowest price', '1080p gaming', 'Students gaming on weekends'],
    notFor: ['Travel (2.2kg)', 'Battery-critical use', 'Professional work'],
    pros: ['RTX 4060 at lowest price', '144Hz display', 'Upgradeable RAM/storage', 'i7 10-core CPU'],
    cons: ['Short gaming battery (~5h)', 'Plastic chassis', 'Basic cooling vs premium gaming laptops'],
    expertNotes: 'MSI Katana offers RTX 4060 gaming at the entry price point. Performance-per-euro is unmatched in the budget gaming segment.',
    userFeedback: 'Budget gamers consistently choose MSI Katana. Thermal throttling under extreme sustained loads is occasionally noted.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=MSI+Katana+15+RTX+4060+i7-13620H&i=computers',
      amazones: 'https://www.amazon.es/s?k=MSI+Katana+15+RTX+4060+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=MSI+Katana+15+RTX+4060',
    },
  },
  {
    id: 'dell-g15',
    name: 'Dell G15 (2024)',
    brand: 'Dell', badge: 'Solid Budget Gaming', badgeColor: 'red',
    priceEUR: 849, valueScore: 8.4,
    image: '/public/laptops/dell-g15.jpg',
    brandFallbackImage: '/public/laptops/dell-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-gaming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen 5 7640HS (6C/12T, 5.0GHz)', gpu: 'NVIDIA GeForce RTX 4060 8GB',
      ram: 16, ramDisplay: '16GB DDR5', storage: '512GB NVMe SSD',
      display: '15.6" FHD IPS 165Hz', weight: 2.54, weightDisplay: '2.54 kg',
      battery: '54Wh (~5h gaming)', batteryHours: 5, os: 'windows',
      refreshRate: 165, upgradeableRam: true, buildQuality: 'plastic',
    },
    hasGpu: true,
    purpose: ['gaming', 'content'],
    portability: ['desk'],
    bestFor: ['1080p gaming', 'Dell gaming reliability', 'Students who game at home', 'Budget RTX gaming'],
    notFor: ['Travel (heavy)', 'Battery use', 'Professional portability'],
    pros: ['RTX 4060 + 165Hz combo', 'Dell build reliability', 'Upgradeable', 'Good thermals'],
    cons: ['Heavy at 2.54kg', 'Short battery', 'Plastic chassis'],
    expertNotes: 'The 165Hz FHD panel combined with RTX 4060 makes this a strong 1080p gaming platform. Dell build quality adds trust.',
    userFeedback: 'Gamers appreciate the Dell warranty and 165Hz panel. Weight is the main drawback for those carrying to uni.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Dell+G15+Ryzen+5+7640HS+RTX+4060+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=Dell+G15+AMD+RTX+4060+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Dell+G15+RTX+4060+AMD',
    },
  },
  {
    id: 'acer-predator-helios-neo-16',
    name: 'Acer Predator Helios Neo 16',
    brand: 'Acer', badge: 'Mid Gaming', badgeColor: 'red',
    priceEUR: 1099, valueScore: 8.5,
    image: '/public/laptops/acer-predator-helios-neo-16.jpg',
    brandFallbackImage: '/public/laptops/acer-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-gaming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core i7-13700HX (16C, 5.0GHz)', gpu: 'NVIDIA GeForce RTX 4070 8GB',
      ram: 16, ramDisplay: '16GB DDR5', storage: '512GB NVMe SSD',
      display: '16" WUXGA IPS 165Hz', weight: 2.60, weightDisplay: '2.60 kg',
      battery: '76Wh (~5h gaming)', batteryHours: 5, os: 'windows',
      refreshRate: 165, upgradeableRam: true, buildQuality: 'plastic-metal',
    },
    hasGpu: true,
    purpose: ['gaming', 'content'],
    portability: ['desk'],
    bestFor: ['1080p/1440p gaming', 'RTX 4070 at mid price', 'Streaming and gaming combo'],
    notFor: ['Travel (2.6kg)', 'Battery use', 'Portable work'],
    pros: ['RTX 4070 GPU', '165Hz display', '16-core i7', 'Upgradeable RAM'],
    cons: ['Heaviest in lineup at 2.6kg', 'Short battery', 'Plastic-heavy design'],
    expertNotes: 'Acer Predator delivers RTX 4070 performance at a lower price than brand-premium competitors like ROG.',
    userFeedback: 'Gaming performance praised. Users note the weight makes it a desktop-replacement more than a portable.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Acer+Predator+Helios+Neo+16+RTX+4070&i=computers',
      amazones: 'https://www.amazon.es/s?k=Acer+Predator+Helios+Neo+16+RTX+4070&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Acer+Predator+Helios+Neo+16+RTX+4070',
    },
  },
  {
    id: 'lenovo-legion-5i-gen9',
    name: 'Lenovo Legion 5i Gen 9',
    brand: 'Lenovo', badge: '#1 Gaming Value', badgeColor: 'red',
    priceEUR: 1199, valueScore: 9.2,
    image: '/public/laptops/lenovo-legion-5i-gen9.jpg',
    brandFallbackImage: '/public/laptops/lenovo-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-gaming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core i7-14650HX (16C, 5.2GHz)', gpu: 'NVIDIA GeForce RTX 4060 8GB',
      ram: 16, ramDisplay: '16GB DDR5 5600MHz', storage: '512GB NVMe SSD',
      display: '15.6" FHD IPS 165Hz', weight: 2.38, weightDisplay: '2.38 kg',
      battery: '80Wh (~5h gaming)', batteryHours: 5, os: 'windows',
      refreshRate: 165, upgradeableRam: true, buildQuality: 'plastic-metal',
    },
    hasGpu: true,
    purpose: ['gaming', 'content'],
    portability: ['desk', 'balanced'],
    bestFor: ['1080p gaming at ultra settings', 'Game streaming', 'Budget-conscious gamers', 'Esports'],
    notFor: ['Frequent travel (heavy)', 'Office on battery', 'Quiet environments'],
    pros: ['RTX 4060 8GB', '165Hz display', 'Upgradeable RAM/storage', 'Best gaming value in EU', 'Strong thermals'],
    cons: ['2.38kg heavy', 'Short battery gaming', 'Loud fans under load'],
    expertNotes: 'RTX 4060 handles 1080p gaming at high/ultra flawlessly. 165Hz makes motion buttery smooth.',
    userFeedback: 'Gaming performance praised as best-in-class for the price. Weight and fan noise noted by students.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Lenovo+Legion+5i+Gen+9+RTX+4060+i7-14650HX&i=computers',
      amazones: 'https://www.amazon.es/s?k=Lenovo+Legion+5i+Gen+9+RTX+4060&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Lenovo+Legion+5i+Gen+9+RTX+4060',
    },
  },
  {
    id: 'asus-rog-zephyrus-g14',
    name: 'ASUS ROG Zephyrus G14 (2024)',
    brand: 'ASUS', badge: 'Portable Powerhouse', badgeColor: 'red',
    priceEUR: 1399, valueScore: 9.1,
    image: '/public/laptops/asus-rog-zephyrus-g14.jpg',
    brandFallbackImage: '/public/laptops/asus-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-gaming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen 9 8945HS (8C/16T, 5.2GHz)', gpu: 'NVIDIA GeForce RTX 4060 8GB',
      ram: 16, ramDisplay: '16GB DDR5', storage: '1TB NVMe SSD',
      display: '14" 2.5K OLED 120Hz', weight: 1.64, weightDisplay: '1.64 kg',
      battery: '73Wh (~8h light)', batteryHours: 8, os: 'windows',
      refreshRate: 120, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: true,
    purpose: ['gaming', 'content'],
    portability: ['balanced', 'travel'],
    bestFor: ['Portable gaming', 'OLED gaming display', 'Gaming + creative hybrid', 'Travelers who game'],
    notFor: ['Pure desk gaming (heavier alternatives better)', 'RAM upgrade needs (soldered)'],
    pros: ['Only 1.64kg with RTX 4060', '2.5K OLED display', '1TB SSD', 'Ryzen 9 powerhouse', 'Best portable gaming'],
    cons: ['Soldered RAM', 'More expensive than non-OLED gaming', 'Smaller 14" screen'],
    expertNotes: 'The G14 is the only gaming laptop combining an OLED display, RTX 4060, and 1.64kg weight — uniquely positioned for gamers who travel.',
    userFeedback: 'Rated best portable gaming laptop by users. The OLED gaming display is frequently described as transformative.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=ASUS+ROG+Zephyrus+G14+2024+RTX+4060+OLED&i=computers',
      amazones: 'https://www.amazon.es/s?k=ASUS+ROG+Zephyrus+G14+RTX+4060+OLED+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=ASUS+ROG+Zephyrus+G14+2024',
    },
  },
  {
    id: 'asus-rog-strix-g16-2024',
    name: 'ASUS ROG Strix G16 (2024)',
    brand: 'ASUS', badge: 'High-End Gaming', badgeColor: 'red',
    priceEUR: 1449, valueScore: 8.8,
    image: '/public/laptops/asus-rog-strix-g16-2024.jpg',
    brandFallbackImage: '/public/laptops/asus-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-gaming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core i9-14900HX (24C, 5.8GHz)', gpu: 'NVIDIA GeForce RTX 4070 8GB',
      ram: 16, ramDisplay: '16GB DDR5 4800MHz', storage: '1TB NVMe SSD',
      display: '16" QHD+ IPS 240Hz', weight: 2.50, weightDisplay: '2.50 kg',
      battery: '90Wh (~5h gaming)', batteryHours: 5, os: 'windows',
      refreshRate: 240, upgradeableRam: true, buildQuality: 'plastic-metal',
    },
    hasGpu: true,
    purpose: ['gaming', 'content'],
    portability: ['desk'],
    bestFor: ['1440p gaming', 'High-refresh competitive gaming', '3D modeling', 'Streaming + gaming'],
    notFor: ['Travel (2.5kg)', 'Battery-critical', 'Silent environments'],
    pros: ['RTX 4070 + 240Hz QHD', 'i9 24-core CPU', '1TB SSD', 'ROG legendary cooling'],
    cons: ['Very heavy 2.5kg', 'Short gaming battery', 'Expensive', 'Noisy fans'],
    expertNotes: 'i9-14900HX + RTX 4070 + 240Hz QHD — handles both demanding AAA titles and content creation workloads.',
    userFeedback: 'Gaming performance exceptional. Weight and fan noise are the primary drawbacks.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=ASUS+ROG+Strix+G16+G614+RTX+4070+i9-14900HX&i=computers',
      amazones: 'https://www.amazon.es/s?k=ASUS+ROG+Strix+G16+RTX+4070+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=ASUS+ROG+Strix+G16+RTX+4070',
    },
  },
  {
    id: 'lenovo-legion-pro-5',
    name: 'Lenovo Legion Pro 5 Gen 8',
    brand: 'Lenovo', badge: 'High-End Value', badgeColor: 'red',
    priceEUR: 1549, valueScore: 8.9,
    image: '/public/laptops/lenovo-legion-pro-5.jpg',
    brandFallbackImage: '/public/laptops/lenovo-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-gaming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen 7 7745HX (8C/16T, 5.4GHz)', gpu: 'NVIDIA GeForce RTX 4070 8GB',
      ram: 32, ramDisplay: '32GB DDR5', storage: '1TB NVMe SSD',
      display: '16" WQXGA IPS 240Hz', weight: 2.50, weightDisplay: '2.50 kg',
      battery: '80Wh (~5h gaming)', batteryHours: 5, os: 'windows',
      refreshRate: 240, upgradeableRam: true, buildQuality: 'plastic-metal',
    },
    hasGpu: true,
    purpose: ['gaming', 'content'],
    portability: ['desk', 'balanced'],
    bestFor: ['1440p/4K gaming', '32GB for streaming+gaming', 'Content creation with GPU', 'High-end gaming value'],
    notFor: ['Travel (heavy)', 'Battery on the go', 'Quiet environments'],
    pros: ['32GB DDR5 RAM', 'RTX 4070 + 240Hz', 'AMD Ryzen 7745HX powerhouse', 'Upgradeable', '1TB SSD'],
    cons: ['2.5kg heavy', 'Short battery', 'Loud under load'],
    expertNotes: '32GB DDR5 + RTX 4070 at this price point is remarkable — run a game, stream, and browser simultaneously without stutter.',
    userFeedback: 'Power users and streamers rate this very highly. 32GB RAM praised as essential for modern workflows.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Lenovo+Legion+Pro+5+Gen+8+RTX+4070+32GB&i=computers',
      amazones: 'https://www.amazon.es/s?k=Lenovo+Legion+Pro+5+RTX+4070+32GB&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Lenovo+Legion+Pro+5+RTX+4070+32GB',
    },
  },
  {
    id: 'hp-omen-16-2024',
    name: 'HP Omen 16 (2024)',
    brand: 'HP', badge: 'Gaming + Workload', badgeColor: 'red',
    priceEUR: 1649, valueScore: 8.4,
    image: '/public/laptops/hp-omen-16-2024.jpg',
    brandFallbackImage: '/public/laptops/hp-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-gaming.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen 9 8945HS (8C, 5.2GHz)', gpu: 'NVIDIA GeForce RTX 4070 8GB',
      ram: 32, ramDisplay: '32GB DDR5', storage: '1TB NVMe SSD',
      display: '16.1" QHD IPS 240Hz', weight: 2.40, weightDisplay: '2.40 kg',
      battery: '83Wh (~5h gaming)', batteryHours: 5, os: 'windows',
      refreshRate: 240, upgradeableRam: true, buildQuality: 'aluminum',
    },
    hasGpu: true,
    purpose: ['gaming', 'content'],
    portability: ['desk'],
    bestFor: ['Heavy gaming with large RAM', 'Video editing + gaming', '3D rendering', 'VMs alongside gaming'],
    notFor: ['Portable daily use', 'Battery-dependent work'],
    pros: ['32GB DDR5 standard', 'RTX 4070 + Ryzen 9', '240Hz QHD', 'Aluminum build quality'],
    cons: ['Expensive at €1,649', '2.4kg heavy', 'Short battery', 'Bulky form factor'],
    expertNotes: '32GB DDR5 makes the Omen 16 unique — running a game, stream, and VM simultaneously is genuinely possible.',
    userFeedback: 'Power users and streamers rate this highly. 32GB praised. Some feel price premium over Legion 5i is not justified for gaming alone.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=HP+Omen+16+Ryzen+9+8945HS+RTX+4070+32GB&i=computers',
      amazones: 'https://www.amazon.es/s?k=HP+Omen+16+AMD+Ryzen+9+RTX+4070+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=HP+Omen+16+RTX+4070+Ryzen+9',
    },
  },
  // ── PREMIUM / CREATOR ────────────────────────────────────
  {
    id: 'lenovo-yoga-7i',
    name: 'Lenovo Yoga 7i 14" (2024)',
    brand: 'Lenovo', badge: 'Premium 2-in-1', badgeColor: 'purple',
    priceEUR: 999, valueScore: 8.7,
    image: '/public/laptops/lenovo-yoga-7i.jpg',
    brandFallbackImage: '/public/laptops/lenovo-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-premium.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core Ultra 5 125U (12C, 4.4GHz)', gpu: 'Intel Arc Graphics (Integrated)',
      ram: 16, ramDisplay: '16GB LPDDR5', storage: '512GB NVMe SSD',
      display: '14" 2.8K OLED Touch 90Hz', weight: 1.40, weightDisplay: '1.40 kg',
      battery: '71Wh (~12h)', batteryHours: 12, os: 'windows',
      refreshRate: 90, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: false,
    purpose: ['student', 'office', 'programming', 'business'],
    portability: ['travel', 'balanced'],
    bestFor: ['2-in-1 touch workflows', 'Students wanting versatility', 'Business travel', 'OLED at mid-price'],
    notFor: ['Gaming', 'GPU workloads', 'RAM-heavy VMs (soldered)'],
    pros: ['2.8K OLED touch display', '360° 2-in-1 hinge', '12h battery', '1.40kg lightweight', 'Aluminum build'],
    cons: ['Soldered RAM', 'Intel Arc limited', 'Core Ultra 5 mid-tier CPU'],
    expertNotes: 'The Yoga 7i is the best value 2-in-1 with an OLED display — touch input for note-taking and drawing adds genuine versatility.',
    userFeedback: 'Students and business users love the versatility. OLED display is the standout feature at this price.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Lenovo+Yoga+7i+14+OLED+Core+Ultra+5+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=Lenovo+Yoga+7i+OLED+Core+Ultra+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Lenovo+Yoga+7i+OLED+2024',
    },
  },
  {
    id: 'lg-gram-16',
    name: 'LG Gram 16 (2024)',
    brand: 'LG', badge: 'Lightest 16"', badgeColor: 'cyan',
    priceEUR: 1299, valueScore: 8.8,
    image: '/public/laptops/lg-gram-16.jpg',
    brandFallbackImage: '/public/laptops/lg-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-business.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core Ultra 7 155H (16C, 4.8GHz)', gpu: 'Intel Arc Graphics (Integrated)',
      ram: 16, ramDisplay: '16GB LPDDR5', storage: '512GB NVMe SSD',
      display: '16" WQXGA IPS 120Hz', weight: 1.19, weightDisplay: '1.19 kg',
      battery: '80Wh (~20h)', batteryHours: 20, os: 'windows',
      refreshRate: 120, upgradeableRam: false, buildQuality: 'carbon-fiber',
    },
    hasGpu: false,
    purpose: ['office', 'business', 'student', 'programming'],
    portability: ['travel', 'balanced'],
    bestFor: ['Business travelers who need big screen', 'Maximum battery life', 'Lightest 16" laptop', 'All-day meetings'],
    notFor: ['Gaming', 'GPU workloads', 'RAM upgrade needs'],
    pros: ['Only 1.19kg — lightest 16" laptop', '~20h battery life', 'MIL-SPEC 810H durability', '120Hz display', 'Carbon fiber'],
    cons: ['Soldered RAM', 'No dedicated GPU', 'LG brand less known in EU', 'Premium price for specs'],
    expertNotes: 'The LG Gram 16 is an engineering marvel — 1.19kg with a 16" display and 20h battery. Unmatched for travel professionals.',
    userFeedback: 'Business travellers rate this as the ultimate travel laptop. Battery life consistently exceeds 15h in real use.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=LG+Gram+16+Core+Ultra+7+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=LG+Gram+16+Core+Ultra+7+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=LG+Gram+16+2024+Core+Ultra',
    },
  },
  {
    id: 'hp-spectre-x360-14',
    name: 'HP Spectre x360 14 (2024)',
    brand: 'HP', badge: 'Premium 2-in-1', badgeColor: 'indigo',
    priceEUR: 1599, valueScore: 8.7,
    image: '/public/laptops/hp-spectre-x360-14.jpg',
    brandFallbackImage: '/public/laptops/hp-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-premium.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core Ultra 7 165U (12C, 4.9GHz)', gpu: 'Intel Arc Graphics (Integrated)',
      ram: 16, ramDisplay: '16GB LPDDR5', storage: '1TB NVMe SSD',
      display: '13.5" 2.8K OLED Touch 120Hz', weight: 1.36, weightDisplay: '1.36 kg',
      battery: '66Wh (~14h)', batteryHours: 14, os: 'windows',
      refreshRate: 120, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: false,
    purpose: ['office', 'business', 'student'],
    portability: ['travel', 'balanced'],
    bestFor: ['Premium Windows 2-in-1', 'Executive business use', 'Touch OLED workflows', 'HP premium brand'],
    notFor: ['Gaming', 'GPU workloads', 'Budget shoppers'],
    pros: ['2.8K OLED touch 120Hz', 'Premium aluminum gem-cut design', '14h battery', '1TB SSD', 'Pen included'],
    cons: ['Expensive', 'Soldered RAM', 'No GPU', '13.5" small for desk use'],
    expertNotes: 'The Spectre x360 14 is HP\'s flagship — the gem-cut aluminum design with OLED touch is the most premium Windows 2-in-1 available.',
    userFeedback: 'Business users rate the design and display quality 5/5. Stylus support praised for note-taking workflows.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=HP+Spectre+x360+14+OLED+Core+Ultra+7+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=HP+Spectre+x360+14+OLED+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=HP+Spectre+x360+14+OLED+2024',
    },
  },
  {
    id: 'apple-macbook-pro-14-m4',
    name: 'Apple MacBook Pro 14" M4',
    brand: 'Apple', badge: 'Pro Productivity', badgeColor: 'indigo',
    priceEUR: 1999, valueScore: 9.3,
    image: '/public/laptops/apple-macbook-pro-14-m4.jpg',
    brandFallbackImage: '/public/laptops/apple-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-premium.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Apple M4 (10-core CPU, 10-core GPU)', gpu: 'Apple M4 10-core (Integrated)',
      ram: 16, ramDisplay: '16GB Unified Memory', storage: '512GB SSD',
      display: '14.2" Liquid Retina XDR 120Hz ProMotion', weight: 1.55, weightDisplay: '1.55 kg',
      battery: '72.4Wh (~24h)', batteryHours: 24, os: 'macos',
      refreshRate: 120, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: false,
    purpose: ['programming', 'content', 'office', 'business'],
    portability: ['travel', 'balanced'],
    bestFor: ['Professional macOS developers', 'Final Cut Pro users', 'All-day battery professionals', 'iOS/macOS development'],
    notFor: ['Windows gaming', 'CUDA/ML workloads', 'Windows-only software'],
    pros: ['24h battery life', 'ProMotion 120Hz XDR display', 'M4 outperforms €3000+ Windows laptops', 'Silent under most workloads'],
    cons: ['Expensive at €1,999', 'macOS only', 'Soldered RAM', 'No NVIDIA GPU'],
    expertNotes: 'M4 chip sets a new efficiency benchmark — outperforms workstations costing twice as much on CPU-bound tasks.',
    userFeedback: 'Professional users call it the best laptop ever owned. Battery and performance rated 5/5.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Apple+MacBook+Pro+14+Zoll+M4+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=Apple+MacBook+Pro+14+M4+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Apple+MacBook+Pro+14+M4+2024',
    },
  },
  {
    id: 'lenovo-thinkpad-x1-carbon-gen12',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    brand: 'Lenovo', badge: 'Elite Business Ultra', badgeColor: 'purple',
    priceEUR: 1799, valueScore: 8.6,
    image: '/public/laptops/lenovo-thinkpad-x1-carbon-gen12.jpg',
    brandFallbackImage: '/public/laptops/lenovo-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-business.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core Ultra 7 165U (12C, 4.9GHz)', gpu: 'Intel Graphics (Integrated)',
      ram: 32, ramDisplay: '32GB LPDDR5x', storage: '1TB NVMe SSD',
      display: '14" WUXGA IPS 60Hz Anti-Glare', weight: 1.12, weightDisplay: '1.12 kg',
      battery: '57Wh (~15h)', batteryHours: 15, os: 'windows',
      refreshRate: 60, upgradeableRam: false, buildQuality: 'carbon-fiber',
    },
    hasGpu: false,
    purpose: ['office', 'programming', 'business'],
    portability: ['travel'],
    bestFor: ['Enterprise developers', 'Frequent business travelers', 'Linux power users', 'DevOps and cloud engineers'],
    notFor: ['Gaming', 'Heavy GPU workloads', 'Budget shoppers'],
    pros: ['Lightest in class at 1.12kg', '32GB LPDDR5x RAM', 'MIL-SPEC 810H durability', 'Excellent Linux support', '15h battery'],
    cons: ['Expensive for integrated graphics', 'No dedicated GPU', '60Hz display', 'RAM not upgradeable'],
    expertNotes: 'Carbon fiber chassis achieves 1.12kg while maintaining MIL-SPEC durability — a remarkable engineering achievement.',
    userFeedback: 'Business professionals call it the ultimate travel laptop. Weight-to-power ratio unmatched.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Lenovo+ThinkPad+X1+Carbon+Gen+12+Core+Ultra+7&i=computers',
      amazones: 'https://www.amazon.es/s?k=Lenovo+ThinkPad+X1+Carbon+Gen+12&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Lenovo+ThinkPad+X1+Carbon+Gen+12',
    },
  },
  {
    id: 'asus-proart-p16',
    name: 'ASUS ProArt P16 (2024)',
    brand: 'ASUS', badge: 'Creator Pro', badgeColor: 'amber',
    priceEUR: 1999, valueScore: 8.8,
    image: '/public/laptops/asus-proart-p16.jpg',
    brandFallbackImage: '/public/laptops/asus-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-creator.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'AMD Ryzen AI 9 HX 370 (12C, 5.1GHz)', gpu: 'NVIDIA GeForce RTX 4070 8GB',
      ram: 32, ramDisplay: '32GB LPDDR5x', storage: '1TB NVMe SSD',
      display: '16" 3.2K OLED 120Hz PANTONE-validated', weight: 1.95, weightDisplay: '1.95 kg',
      battery: '90Wh (~10h)', batteryHours: 10, os: 'windows',
      refreshRate: 120, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: true,
    purpose: ['content'],
    portability: ['desk', 'balanced'],
    bestFor: ['Professional colorists', 'Video editors', 'Graphic designers', '3D artists', 'PANTONE-accurate color work'],
    notFor: ['Gaming-focused', 'Budget buyers', 'RAM upgrade needs'],
    pros: ['PANTONE OLED 3.2K display', '32GB RAM', 'RTX 4070', 'Ryzen AI 9', 'Lightest creator workstation'],
    cons: ['Expensive €1,999', 'Soldered RAM', 'GPU limited vs gaming laptops'],
    expertNotes: 'PANTONE-validated 0.2 DeltaE OLED — the professional standard for colorists. Ryzen AI 9 enables on-device AI acceleration.',
    userFeedback: 'Professional designers rate the display accuracy industry-leading. RTX 4070 export speeds praised.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=ASUS+ProArt+P16+OLED+RTX+4070+Ryzen+AI+9&i=computers',
      amazones: 'https://www.amazon.es/s?k=ASUS+ProArt+P16+OLED+RTX+4070+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=ASUS+ProArt+P16+OLED+RTX+4070',
    },
  },
  {
    id: 'asus-proart-studiobook-16',
    name: 'ASUS ProArt Studiobook 16 OLED',
    brand: 'ASUS', badge: "Creator's Workstation", badgeColor: 'amber',
    priceEUR: 2299, valueScore: 8.6,
    image: '/public/laptops/asus-proart-studiobook-16.jpg',
    brandFallbackImage: '/public/laptops/asus-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-creator.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core Ultra 9 185H (22C, 5.1GHz)', gpu: 'NVIDIA RTX 4060 8GB',
      ram: 32, ramDisplay: '32GB DDR5 5600MHz', storage: '1TB NVMe SSD',
      display: '16" OLED 3.2K 120Hz PANTONE-validated', weight: 1.85, weightDisplay: '1.85 kg',
      battery: '76Wh (~10h)', batteryHours: 10, os: 'windows',
      refreshRate: 120, upgradeableRam: true, buildQuality: 'aluminum',
    },
    hasGpu: true,
    purpose: ['content'],
    portability: ['desk', 'balanced'],
    bestFor: ['Professional colorists', 'Video editors (Premiere/DaVinci)', 'Graphic designers', '3D artists (Blender)'],
    notFor: ['Gaming-focused use', 'Budget buyers', 'Portable travel use'],
    pros: ['PANTONE-validated OLED 3.2K', '32GB DDR5', 'RTX 4060 GPU', '22-core Intel Ultra 9', 'Upgradeable RAM'],
    cons: ['Expensive €2,299', 'Average battery', '1.85kg'],
    expertNotes: 'PANTONE-validated 0.2 DeltaE OLED is the professional standard for colorists. 22-core CPU + 32GB handles any creative pipeline.',
    userFeedback: 'Professional designers rate display accuracy as industry-leading. Price is the most common objection.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=ASUS+ProArt+Studiobook+16+OLED+H7604+RTX+4060&i=computers',
      amazones: 'https://www.amazon.es/s?k=ASUS+ProArt+Studiobook+16+OLED+RTX+4060&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=ASUS+ProArt+Studiobook+16+OLED',
    },
  },
  {
    id: 'dell-xps-16',
    name: 'Dell XPS 16 (2024)',
    brand: 'Dell', badge: 'Premium Creator', badgeColor: 'indigo',
    priceEUR: 2199, valueScore: 8.7,
    image: '/public/laptops/dell-xps-16.jpg',
    brandFallbackImage: '/public/laptops/dell-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-creator.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core Ultra 9 185H (22C, 5.1GHz)', gpu: 'NVIDIA GeForce RTX 4070 8GB',
      ram: 32, ramDisplay: '32GB LPDDR5x', storage: '1TB NVMe SSD',
      display: '16.3" 3.5K OLED Touch 120Hz', weight: 2.12, weightDisplay: '2.12 kg',
      battery: '99.5Wh (~12h)', batteryHours: 12, os: 'windows',
      refreshRate: 120, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: true,
    purpose: ['content', 'programming'],
    portability: ['desk', 'balanced'],
    bestFor: ['Premium Windows creator', 'Video editing', '3D design', 'Photography professionals', 'Dell premium brand'],
    notFor: ['Budget shoppers', 'Gaming-only use', 'Travel (2.12kg)'],
    pros: ['3.5K OLED touch display', 'RTX 4070 GPU', '32GB RAM', '99.5Wh battery', 'Premium Dell CNC aluminum'],
    cons: ['Very expensive €2,199', 'Soldered RAM', 'Heavy 2.12kg', 'Fan noise under load'],
    expertNotes: 'The Dell XPS 16 combines a class-leading 3.5K OLED touch screen with RTX 4070 GPU — the definitive premium Windows creator laptop.',
    userFeedback: 'Creative professionals rate the display as the best available on Windows. Price is the only barrier.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Dell+XPS+16+9640+Core+Ultra+9+RTX+4070+OLED&i=computers',
      amazones: 'https://www.amazon.es/s?k=Dell+XPS+16+RTX+4070+OLED+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Dell+XPS+16+RTX+4070+OLED',
    },
  },
  {
    id: 'apple-macbook-pro-16-m4-pro',
    name: 'Apple MacBook Pro 16" M4 Pro',
    brand: 'Apple', badge: 'Ultimate Mac', badgeColor: 'indigo',
    priceEUR: 2999, valueScore: 9.0,
    image: '/public/laptops/apple-macbook-pro-16-m4-pro.jpg',
    brandFallbackImage: '/public/laptops/apple-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-premium.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Apple M4 Pro (14-core CPU, 20-core GPU)', gpu: 'Apple M4 Pro 20-core (Integrated)',
      ram: 24, ramDisplay: '24GB Unified Memory', storage: '512GB SSD',
      display: '16.2" Liquid Retina XDR 120Hz ProMotion', weight: 2.14, weightDisplay: '2.14 kg',
      battery: '100Wh (~22h)', batteryHours: 22, os: 'macos',
      refreshRate: 120, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: false,
    purpose: ['programming', 'content'],
    portability: ['desk', 'balanced'],
    bestFor: ['Professional video editors', 'ML on Apple Neural Engine', 'High-end iOS development', '8K ProRes workflows'],
    notFor: ['Windows gaming', 'CUDA/NVIDIA workflows', 'Windows-dependent software'],
    pros: ['M4 Pro 14-core + 20-core GPU', '22h battery on 16"', 'Best laptop display (XDR ProMotion)', '24GB unified memory'],
    cons: ['Most expensive at €2,999', 'macOS only', 'RAM not upgradeable', 'Overkill for most users'],
    expertNotes: 'M4 Pro is the most efficient high-performance processor ever in a laptop. 20-core GPU handles workloads previously requiring a Mac Pro tower.',
    userFeedback: 'Professional editors call it transformative. 22h battery on 16" described as impossible until you use it.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Apple+MacBook+Pro+16+Zoll+M4+Pro+2024&i=computers',
      amazones: 'https://www.amazon.es/s?k=Apple+MacBook+Pro+16+M4+Pro+2024&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Apple+MacBook+Pro+16+M4+Pro+2024',
    },
  },
  {
    id: 'dell-xps-13-2024',
    name: 'Dell XPS 13 (2024)',
    brand: 'Dell', badge: 'Most Compact Premium', badgeColor: 'slate',
    priceEUR: 1349, valueScore: 7.9,
    image: '/public/laptops/dell-xps-13-2024.jpg',
    brandFallbackImage: '/public/laptops/dell-laptop.jpg',
    categoryFallbackImage: '/public/laptops/category-premium.jpg',
    defaultFallbackImage: '/public/laptops/default-laptop.jpg',
    specs: {
      cpu: 'Intel Core Ultra 7 165H (16C, 5.0GHz)', gpu: 'Intel Arc Graphics (Integrated)',
      ram: 16, ramDisplay: '16GB LPDDR5x', storage: '512GB NVMe SSD',
      display: '13.4" FHD+ OLED Touch 60Hz', weight: 1.17, weightDisplay: '1.17 kg',
      battery: '55Wh (~10h)', batteryHours: 10, os: 'windows',
      refreshRate: 60, upgradeableRam: false, buildQuality: 'aluminum',
    },
    hasGpu: false,
    purpose: ['office', 'programming', 'business'],
    portability: ['travel'],
    bestFor: ['Frequent travelers wanting Windows', 'Compact premium design', 'Touch screen workflows', 'Business presentations'],
    notFor: ['Gaming', 'Budget buyers', 'Heavy development workloads', 'Large screen preference'],
    pros: ['Lightest at 1.17kg', 'OLED touch display', 'Premium aluminum CNC build', 'Thin and compact'],
    cons: ['Short battery (~10h vs competitors)', 'Higher price for specs', 'No dedicated GPU', 'Soldered RAM'],
    expertNotes: 'XPS 13 is the pinnacle of Windows compact design. At 1.17kg with OLED touch, it is the best ultraportable Windows laptop.',
    userFeedback: 'Build quality and design rated highest. Battery life is the most common complaint.',
    links: {
      amazonde: 'https://www.amazon.de/s?k=Dell+XPS+13+9345+Core+Ultra+7+OLED&i=computers',
      amazones: 'https://www.amazon.es/s?k=Dell+XPS+13+9345+Core+Ultra+7&i=computers',
      mediamarkt: 'https://www.mediamarkt.de/de/search.html?query=Dell+XPS+13+Core+Ultra+2024',
    },
  },
]; // end KNOWLEDGE_BASE


// ============================================================
// INFERENCE RULES
// ============================================================
const INFERENCE_RULES = [
  { id:'R01', name:'Gaming → GPU Required',
    condition: a => a.purpose==='gaming',
    apply: (l) => ({ score: l.hasGpu?30:-20, reason: l.hasGpu?'Gaming selected → dedicated GPU matched':'Gaming selected → no dedicated GPU (penalized)', match: l.hasGpu }) },
  { id:'R02', name:'Programming → RAM ≥16GB',
    condition: a => a.purpose==='programming',
    apply: (l) => { const ok=l.specs.ram>=16; return {score:ok?20:5,reason:ok?'Programming → sufficient RAM (≥16GB) matched':'Programming → low RAM limits development environments',match:ok}; } },
  { id:'R03', name:'Student/Office → Battery & Price',
    condition: a => a.purpose==='student'||a.purpose==='office',
    apply: (l,a) => { const b=l.specs.batteryHours>=8,p=l.priceEUR<=a.budget; return {score:(b?10:0)+(p?10:0),reason:'Student/office → battery and budget prioritized',match:b&&p}; } },
  { id:'R04', name:'Content Creation → GPU & OLED',
    condition: a => a.purpose==='content',
    apply: (l) => { const oled=l.specs.display.toLowerCase().includes('oled'); return {score:(l.hasGpu?15:0)+(oled?15:0),reason:'Content creation → GPU acceleration and display quality prioritized',match:l.hasGpu||oled}; } },
  { id:'R05', name:'Business → Premium Build & Battery',
    condition: a => a.purpose==='business',
    apply: (l) => { const p=['aluminum','carbon-fiber','military-grade'].includes(l.specs.buildQuality),b=l.specs.batteryHours>=10; return {score:(p?12:0)+(b?10:0),reason:'Business → premium build and battery prioritized',match:p&&b}; } },
  { id:'R06', name:'Travel → Lightweight ≤1.5kg',
    condition: a => a.portability==='travel',
    apply: (l) => { const light=l.specs.weight<=1.5; return {score:light?20:(l.specs.weight<=1.9?5:-10),reason:light?'Travel → lightweight (≤1.5kg) matched':'Travel → laptop heavier than ideal for frequent travel',match:light}; } },
  { id:'R07', name:'Low Budget → Value Priority',
    condition: a => a.budget&&a.budget<=800,
    apply: (l,a) => { const w=l.priceEUR<=a.budget; return {score:w?15:-5,reason:w?'Low budget → laptop within budget':'Laptop exceeds stated low budget',match:w}; } },
  { id:'R08', name:'macOS Required → Apple Only',
    condition: a => a.os==='macos',
    apply: (l) => ({score:l.specs.os==='macos'?25:-50,reason:l.specs.os==='macos'?'macOS selected → Apple laptop matched':'macOS selected → non-Apple laptop penalized',match:l.specs.os==='macos'}) },
  { id:'R09', name:'Windows Gaming → Exclude macOS',
    condition: a => a.purpose==='gaming'&&a.os!=='macos',
    apply: (l) => ({score:l.specs.os==='macos'?-30:0,reason:l.specs.os==='macos'?'Gaming with Windows → macOS excluded':null,match:l.specs.os!=='macos'}) },
  { id:'R10', name:'VM Use → High RAM (≥16GB)',
    condition: a => a.vmUse==='yes',
    apply: (l) => { const h=l.specs.ram>=32,m=l.specs.ram>=16; return {score:h?25:(m?10:-5),reason:h?'VM use → high RAM (≥32GB) matched — excellent for multiple VMs':'VM use → RAM matches for basic VM usage',match:m}; } },
  { id:'R11', name:'Content + GPU → GPU Acceleration',
    condition: a => a.purpose==='content'&&a.gpu==='yes',
    apply: (l) => ({score:(l.hasGpu?20:-10)+(l.specs.ram>=16?10:0),reason:l.hasGpu?'Video editing → dedicated GPU for render acceleration':'Video editing → no dedicated GPU slows rendering',match:l.hasGpu}) },
  { id:'R12', name:'GPU Required → Dedicated Only',
    condition: a => a.gpu==='yes',
    apply: (l) => ({score:l.hasGpu?25:-30,reason:l.hasGpu?'Dedicated GPU required → matched':'Dedicated GPU required but integrated graphics only',match:l.hasGpu}) },
  { id:'R13', name:'No GPU → Battery Boost',
    condition: a => a.gpu==='no',
    apply: (l) => ({score:!l.hasGpu?10:-5,reason:!l.hasGpu?'No GPU needed → integrated graphics boosts battery':null,match:!l.hasGpu}) },
  { id:'R14', name:'Long Battery Required',
    condition: a => a.battery==='yes',
    apply: (l) => { const ex=l.specs.batteryHours>=15,g=l.specs.batteryHours>=10; return {score:ex?20:(g?10:-10),reason:ex?'Long battery required → excellent (≥15h) matched':(g?'Long battery required → good (≥10h) matched':'Long battery required but battery below average'),match:g}; } },
  { id:'R15', name:'Premium Build Required',
    condition: a => a.premium==='yes',
    apply: (l) => { const p=['aluminum','carbon-fiber'].includes(l.specs.buildQuality); return {score:p?15:-5,reason:p?'Premium build → aluminum/carbon matched':'Premium build required but chassis is plastic',match:p}; } },
  { id:'R16', name:'Upgradeability Required',
    condition: a => a.upgradeable==='yes',
    apply: (l) => ({score:l.specs.upgradeableRam?12:-8,reason:l.specs.upgradeableRam?'Upgradeability → RAM slot available':'Upgradeability required but RAM is soldered',match:l.specs.upgradeableRam}) },
  { id:'R17', name:'RAM Requirement Match',
    condition: a => !!a.ram,
    apply: (l,a) => { const req=parseInt(a.ram)||8,meets=l.specs.ram>=req,exceeds=l.specs.ram>=req*2; return {score:exceeds?15:(meets?8:-15),reason:exceeds?`RAM exceeded (need ${req}GB, has ${l.specs.ram}GB)`:(meets?`RAM met (need ${req}GB, has ${l.specs.ram}GB)`:`RAM insufficient (need ${req}GB, only ${l.specs.ram}GB)`),match:meets}; } },
  { id:'R18', name:'Linux → ThinkPad Priority',
    condition: a => a.os==='linux',
    apply: (l) => { const tp=l.id.includes('thinkpad')||l.id.includes('framework'),nm=l.specs.os!=='macos'; return {score:(nm?10:-30)+(tp?15:0),reason:tp?'Linux → ThinkPad/Framework has best-in-class Linux support':(nm?'Linux-compatible Windows laptop':'macOS incompatible with Linux requirement'),match:nm}; } },
];

// ============================================================
// STATE
// ============================================================
const state = {
  step:1, totalSteps:10,
  answers:{ budget:null,purpose:null,battery:null,portability:null,gaming:null,vmUse:null,ram:null,gpu:null,os:null,premium:null },
  results:[], compareList:[],
  matchTier: 1, relaxedFields:[],
};

// ============================================================
// WIZARD STEPS
// ============================================================
const STEPS = [
  { key:'budget', title:'What is your budget?', subtitle:'The inference engine filters and scores laptops within your price range.', type:'budget' },
  { key:'purpose', title:'What is your primary use case?', subtitle:'This activates the main inference rules and shapes the hardware profile.', type:'options', options:[
    { value:'student', label:'Student & Daily Use', desc:'Web, email, notes, video calls, light tasks' },
    { value:'programming', label:'Software Development', desc:'Coding, Docker, databases, servers, IDEs' },
    { value:'content', label:'Video / Photo Editing & Design', desc:'Premiere, DaVinci, Blender, Photoshop, 3D' },
    { value:'gaming', label:'Gaming & High Performance', desc:'AAA games, streaming, esports, VR' },
    { value:'business', label:'Business & Professional', desc:'Presentations, enterprise tools, travel' },
    { value:'office', label:'Office Productivity', desc:'Spreadsheets, documents, meetings, email' },
  ]},
  { key:'battery', title:'Do you need long battery life?', subtitle:'Activates Rule R14 — long battery laptops get bonus points.', type:'options', options:[
    { value:'yes', label:'Yes — Very Important', desc:'I work 8+ hours away from power outlets' },
    { value:'moderate', label:'Moderate', desc:'5–8 hours is enough for my typical day' },
    { value:'no', label:'Not Critical', desc:'I mostly work near a power outlet' },
  ]},
  { key:'portability', title:'How portable does it need to be?', subtitle:'Activates Rule R06 — travel use strongly prioritizes laptops ≤1.5kg.', type:'options', options:[
    { value:'travel', label:'Always Traveling', desc:'Daily commute, flights, ultra-light preferred' },
    { value:'balanced', label:'Balanced', desc:'Office + occasional travel, 14–15" sweet spot' },
    { value:'desk', label:'Mostly at Desk', desc:'Home/office setup — power and screen size first' },
  ]},
  { key:'gaming', title:'Do you play games?', subtitle:'Gaming activates Rules R01 and R09 — GPU requirement and OS filtering.', type:'options', options:[
    { value:'serious', label:'Yes — Serious Gaming', desc:'AAA titles, 60+ FPS, high settings required' },
    { value:'casual', label:'Casual / Light Gaming', desc:'Indie games, older titles, low-demand' },
    { value:'no', label:'No Gaming', desc:'I do not play games on my laptop' },
  ]},
  { key:'vmUse', title:'Do you use virtual machines or Docker?', subtitle:'VM use activates Rule R10 — high RAM (≥32GB) and strong CPU prioritized.', type:'options', options:[
    { value:'yes', label:'Yes — Regularly', desc:'VMs, Docker, Kubernetes, Kali Linux, pen testing' },
    { value:'sometimes', label:'Occasionally', desc:'Light Docker use, basic containers' },
    { value:'no', label:'No', desc:'I do not use virtual machines or Docker' },
  ]},
  { key:'ram', title:'How much RAM do you need?', subtitle:'Rule R17 matches RAM requirements — insufficient RAM scores a penalty.', type:'options', options:[
    { value:'8', label:'8 GB', desc:'Basic tasks — web, email, documents' },
    { value:'16', label:'16 GB', desc:'Standard for development, multitasking, content' },
    { value:'32', label:'32 GB', desc:'VMs, heavy development, 3D, video editing' },
    { value:'64', label:'64 GB+', desc:'Extreme ML workloads, large VMs, AI inference' },
  ]},
  { key:'gpu', title:'Do you need a dedicated GPU?', subtitle:'Activates Rules R12/R13 — strong positive/negative scoring applied.', type:'options', options:[
    { value:'yes', label:'Yes — Required', desc:'Gaming, CUDA/ML, 3D rendering, CAD' },
    { value:'no', label:'No — Integrated is Fine', desc:'Better battery, thinner, lighter laptop' },
    { value:'any', label:"Doesn't Matter", desc:'Show me the best regardless of GPU type' },
  ]},
  { key:'os', title:'Operating system preference?', subtitle:'Rules R08, R09, R18 handle OS matching. macOS and Linux have strict filter rules.', type:'options', options:[
    { value:'windows', label:'Windows', desc:'Widest software compatibility, most hardware choice' },
    { value:'macos', label:'macOS', desc:'Apple ecosystem — best battery, silent, premium' },
    { value:'linux', label:'Linux', desc:'Open source — ThinkPads and Framework prioritized' },
    { value:'any', label:'No Preference', desc:'Show best match regardless of OS' },
  ]},
  { key:'premium', title:'Do you need premium build quality?', subtitle:'Rule R15 — aluminum and carbon-fiber builds get bonus points.', type:'options', options:[
    { value:'yes', label:'Yes — Premium Build', desc:'Aluminum/carbon-fiber chassis, durability matters' },
    { value:'no', label:'Not Essential', desc:'Plastic is fine — I prioritize specs over aesthetics' },
  ]},
];

const BADGE_COLORS = {
  emerald:'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  blue:'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  purple:'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  cyan:'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  red:'bg-red-500/20 text-red-400 border border-red-500/30',
  amber:'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  indigo:'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
  slate:'bg-slate-600/30 text-slate-300 border border-slate-500/30',
};

// ============================================================
// MATCH QUALITY LABEL
// ============================================================
function matchQualityLabel(confidence) {
  if (confidence >= 85) return { label:'Excellent Match', color:'text-emerald-400', bg:'bg-emerald-500/15 border-emerald-500/30' };
  if (confidence >= 70) return { label:'Good Match',      color:'text-blue-400',   bg:'bg-blue-500/15 border-blue-500/30' };
  if (confidence >= 55) return { label:'Partial Match',   color:'text-amber-400',  bg:'bg-amber-500/15 border-amber-500/30' };
  return                       { label:'Alternative',     color:'text-slate-400',  bg:'bg-slate-500/15 border-slate-500/30' };
}

// ============================================================
// INIT
// ============================================================
function init() {
  renderProgressDots();
  renderStep(1);
  document.getElementById('sort-select').addEventListener('change', handleSortChange);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{});
}

function renderProgressDots() {
  document.getElementById('progress-dots').innerHTML =
    Array.from({length:state.totalSteps},(_,i)=>`<div class="progress-dot ${i===0?'active':''}" data-dot="${i}"></div>`).join('');
}
function updateProgressDots() {
  document.querySelectorAll('.progress-dot').forEach((d,i)=>{ d.className='progress-dot'+(i<state.step?' active':''); });
  document.getElementById('step-counter').textContent=`Step ${state.step} of ${state.totalSteps}`;
}

// ============================================================
// STEP RENDERING
// ============================================================
function renderStep(stepNum) {
  state.step=stepNum;
  const cfg=STEPS[stepNum-1];
  let html=`<p class="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-2">Step ${stepNum} of ${state.totalSteps}</p>
    <h2 class="text-xl sm:text-2xl font-bold mb-1">${cfg.title}</h2>
    <p class="text-slate-400 text-sm mb-6">${cfg.subtitle}</p>`;
  if (cfg.type==='budget') {
    html+=`<div class="flex items-center gap-3 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3 mb-5 focus-within:border-violet-500 transition-colors">
      <span class="text-2xl font-black text-cyan-400">€</span>
      <input type="number" id="budget-input" class="bg-transparent flex-1 text-2xl font-bold outline-none text-white placeholder-slate-600"
        placeholder="e.g. 1500" min="300" max="10000" value="${state.answers.budget||''}">
    </div>
    <p class="text-xs text-slate-600 mb-5">Min €300 · Max €10,000 · EU market prices</p>
    <button class="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold text-base transition-all" onclick="handleBudgetNext()">Continue →</button>`;
  } else {
    html+=`<div class="flex flex-col gap-2.5">`;
    cfg.options.forEach(opt=>{
      const sel=state.answers[cfg.key]===opt.value;
      html+=`<button class="option-card text-left px-4 py-3.5 rounded-xl border transition-all duration-150 ${sel?'selected':''}"
        onclick="selectOption('${cfg.key}','${opt.value}',this)">
        <div class="font-semibold text-base">${opt.label}</div>
        <div class="text-slate-500 text-sm mt-0.5">${opt.desc}</div>
      </button>`;
    });
    html+=`</div>`;
  }
  document.getElementById('step-content').innerHTML=html;
  updateProgressDots();
  document.getElementById('prev-btn').disabled=stepNum===1;
  if (cfg.type==='budget') {
    const inp=document.getElementById('budget-input');
    inp.focus();
    inp.addEventListener('keydown',e=>{if(e.key==='Enter')handleBudgetNext();});
  }
}

function handleBudgetNext() {
  const val=parseInt(document.getElementById('budget-input').value);
  if (!val||val<300) {
    const inp=document.getElementById('budget-input');
    inp.classList.add('shake'); setTimeout(()=>inp.classList.remove('shake'),400); return;
  }
  state.answers.budget=val; nextStep();
}
function selectOption(key,value,btn) {
  btn.closest('.flex').querySelectorAll('.option-card').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected'); state.answers[key]=value;
  if (key==='gaming'&&value==='serious'&&!state.answers.gpu) state.answers.gpu='yes';
  setTimeout(()=>nextStep(),280);
}
function nextStep() { if (state.step<state.totalSteps) renderStep(state.step+1); else showResults(); }
function prevStep() { if (state.step>1) renderStep(state.step-1); }

// ============================================================
// INFERENCE ENGINE
// ============================================================
function runInferenceEngine(laptop, answers) {
  const activatedRules=[];
  let score=50;
  for (const rule of INFERENCE_RULES) {
    if (rule.condition(answers)) {
      const r=rule.apply(laptop,answers);
      score+=r.score;
      if (r.reason) activatedRules.push({id:rule.id,name:rule.name,score:r.score,reason:r.reason,matched:r.match});
    }
  }
  // Budget proximity bonus
  if (answers.budget) {
    const diff=answers.budget-laptop.priceEUR;
    score += diff>=0 ? (1-diff/answers.budget)*20 : Math.max(0,10+diff/80);
  }
  // Value score bonus
  score += (laptop.valueScore-7)*3;
  return { score:Math.max(0,score), activatedRules };
}

// ============================================================
// CONFIDENCE SCORE
// ============================================================
function computeConfidence(laptop, answers, activatedRules) {
  const checks = [
    answers.os==='any'||!answers.os ? true : answers.os==='linux' ? laptop.specs.os!=='macos' : laptop.specs.os===answers.os,
    laptop.specs.ram>=(parseInt(answers.ram)||8),
    answers.gpu==='yes'?laptop.hasGpu:answers.gpu==='no'?!laptop.hasGpu:true,
    answers.battery==='yes'?laptop.specs.batteryHours>=10:true,
    answers.portability==='travel'?laptop.specs.weight<=1.6:answers.portability==='desk'?laptop.specs.weight>=1.5:true,
    laptop.priceEUR<=answers.budget*1.2,
    answers.gaming==='serious'?laptop.hasGpu:true,
    answers.vmUse==='yes'?laptop.specs.ram>=16:true,
    answers.premium==='yes'?['aluminum','carbon-fiber','military-grade'].includes(laptop.specs.buildQuality):true,
  ];
  const base=Math.round(checks.filter(Boolean).length/checks.length*100);
  const ruleRate=activatedRules.length>0?activatedRules.filter(r=>r.matched).length/activatedRules.length:0.5;
  return Math.min(99,Math.round(base*0.6+ruleRate*100*0.4));
}

// ============================================================
// 3-TIER FALLBACK ENGINE
// ============================================================
function getMatchedLaptops(answers) {
  const score = (l) => {
    const {score,activatedRules}=runInferenceEngine(l,answers);
    const confidence=computeConfidence(l,answers,activatedRules);
    const {badges,warnings}=generateMatchBadges(l,answers);
    return {...l,matchScore:score,confidence,activatedRules,badges,warnings};
  };

  // Hard OS exclusion helper
  const osOk = (l, strict=true) => {
    if (!answers.os||answers.os==='any') return true;
    if (answers.os==='linux') return l.specs.os!=='macos';
    if (answers.os==='macos') return l.specs.os==='macos';
    if (answers.os==='windows') return l.specs.os!=='macos';
    return true;
  };

  // ── TIER 1: Strict ───────────────────────────────────────
  const ramReq = Math.min(parseInt(answers.ram)||8, 32);
  const tier1 = KNOWLEDGE_BASE
    .filter(l => osOk(l) && (answers.gpu!=='yes'||l.hasGpu) && l.specs.ram>=ramReq && l.priceEUR<=answers.budget*1.25)
    .map(score).sort((a,b)=>b.matchScore-a.matchScore).slice(0,9);

  if (tier1.length>=3) {
    state.matchTier=1; state.relaxedFields=[];
    return tier1;
  }

  // ── TIER 2: Relaxed (drop GPU hard req, relax budget, relax RAM) ─
  const relaxed=[];
  if (answers.gpu==='yes'&&tier1.length<3) relaxed.push('dedicated GPU requirement');
  const ramRelaxed = Math.max(8, ramReq-8);
  if (ramRelaxed<ramReq) relaxed.push('RAM minimum');
  relaxed.push('budget range (+50%)');

  const tier2 = KNOWLEDGE_BASE
    .filter(l => osOk(l) && l.specs.ram>=ramRelaxed && l.priceEUR<=answers.budget*1.5)
    .map(score).sort((a,b)=>b.matchScore-a.matchScore).slice(0,9);

  if (tier2.length>=3) {
    state.matchTier=2; state.relaxedFields=relaxed;
    return tier2;
  }

  // ── TIER 3: Alternative (OS soft, open budget) ──────────
  relaxed.push('OS preference', 'budget limit');
  const tier3 = KNOWLEDGE_BASE
    .map(score).sort((a,b)=>b.matchScore-a.matchScore).slice(0,9);

  state.matchTier=3; state.relaxedFields=relaxed;
  return tier3;
}

// ============================================================
// MATCH BADGES & WARNINGS
// ============================================================
function generateMatchBadges(laptop, answers) {
  const badges=[], warnings=[];
  if (laptop.priceEUR<=answers.budget) badges.push('✓ Within your budget');
  if (laptop.priceEUR<=answers.budget*0.8) badges.push('✓ Significantly under budget');
  if (laptop.specs.batteryHours>=15) badges.push('✓ Excellent battery life');
  else if (laptop.specs.batteryHours>=10) badges.push('✓ Good battery life');
  if (laptop.specs.weight<=1.3) badges.push('✓ Ultra-lightweight');
  else if (laptop.specs.weight<=1.6) badges.push('✓ Lightweight & portable');
  if (laptop.hasGpu&&answers.gpu==='yes') badges.push('✓ Dedicated GPU matched');
  if (laptop.specs.ram>=32) badges.push('✓ High RAM (32GB+)');
  else if (laptop.specs.ram>=16) badges.push('✓ Sufficient RAM (16GB)');
  if (laptop.specs.display.toLowerCase().includes('oled')) badges.push('✓ OLED display');
  if (laptop.specs.upgradeableRam) badges.push('✓ RAM upgradeable');
  if (laptop.valueScore>=9.0) badges.push('✓ Top value score');
  if (['aluminum','carbon-fiber'].includes(laptop.specs.buildQuality)) badges.push('✓ Premium build');
  if (laptop.specs.refreshRate>=120) badges.push('✓ High refresh rate');
  if (answers.purpose&&laptop.purpose.includes(answers.purpose)) badges.push('✓ Matched to your use case');
  if (answers.os==='linux'&&(laptop.id.includes('thinkpad')||laptop.id.includes('framework'))) badges.push('✓ Best Linux compatibility');

  if (laptop.priceEUR>answers.budget) warnings.push('⚠ Slightly over your budget');
  if (laptop.priceEUR>answers.budget*1.3) warnings.push('⚠ Significantly over budget');
  if (answers.gaming==='serious'&&!laptop.hasGpu) warnings.push('⚠ No dedicated GPU for gaming');
  if (answers.battery==='yes'&&laptop.specs.batteryHours<8) warnings.push('⚠ Short battery for your needs');
  if (answers.portability==='travel'&&laptop.specs.weight>1.8) warnings.push('⚠ Heavy for frequent travel');
  if (answers.vmUse==='yes'&&laptop.specs.ram<16) warnings.push('⚠ Low RAM for virtual machines');
  if (answers.ram&&laptop.specs.ram<parseInt(answers.ram)) warnings.push(`⚠ RAM below your ${answers.ram}GB requirement`);
  if (!laptop.specs.upgradeableRam&&answers.upgradeable==='yes') warnings.push('⚠ RAM is soldered — not upgradeable');
  if (laptop.specs.buildQuality==='plastic'&&answers.premium==='yes') warnings.push('⚠ Plastic chassis — not premium');
  if (laptop.specs.batteryHours<=5&&answers.portability!=='desk') warnings.push('⚠ Very short battery away from desk');
  return {badges,warnings};
}

// ============================================================
// SHOW RESULTS
// ============================================================
function showResults() {
  document.getElementById('wizard-section').classList.add('hidden');
  document.getElementById('results-section').classList.remove('hidden');
  document.getElementById('restart-header-btn').classList.remove('hidden');

  state.results = getMatchedLaptops(state.answers);

  renderResults(state.results);
  document.getElementById('used-markets-banner').classList.toggle('hidden', state.answers.condition!=='used');
  document.getElementById('linux-note').classList.toggle('hidden', state.answers.os!=='linux');

  const subtitle=document.getElementById('results-subtitle');
  const tierLabels=['','Strict Match','Relaxed Match','Alternative Suggestions'];
  subtitle.textContent=`${state.results.length} laptops · ${tierLabels[state.matchTier]} · Rule-based inference applied`;
}

function handleSortChange() {
  const s=document.getElementById('sort-select').value;
  let sorted=[...state.results];
  if (s==='price-asc') sorted.sort((a,b)=>a.priceEUR-b.priceEUR);
  else if (s==='price-desc') sorted.sort((a,b)=>b.priceEUR-a.priceEUR);
  else if (s==='value') sorted.sort((a,b)=>b.valueScore-a.valueScore);
  else if (s==='confidence') sorted.sort((a,b)=>b.confidence-a.confidence);
  else sorted.sort((a,b)=>b.matchScore-a.matchScore);
  renderResults(sorted);
}

function renderResults(laptops) {
  const grid=document.getElementById('results-grid');
  document.getElementById('no-results').classList.add('hidden');

  // Constraint relaxation notice
  renderRelaxationNotice();

  // Top 3 panel
  const topOverall=laptops[0];
  const topBudget=[...laptops].sort((a,b)=>(b.valueScore/b.priceEUR)-(a.valueScore/a.priceEUR))[0];
  const topPerf=[...laptops].sort((a,b)=>b.valueScore-a.valueScore)[0];
  document.getElementById('top-picks-container').innerHTML=renderTopThreePicks(topOverall,topBudget,topPerf);

  grid.innerHTML=laptops.map((l,i)=>renderLaptopCard(l,i)).join('');
  state.compareList.forEach(id=>{
    const cb=document.querySelector(`.compare-checkbox[data-id="${id}"]`);
    if (cb) setCompareCheckbox(cb,true);
  });
}

// ============================================================
// CONSTRAINT RELAXATION NOTICE
// ============================================================
function renderRelaxationNotice() {
  let el=document.getElementById('relaxation-notice');
  if (!el) {
    el=document.createElement('div');
    el.id='relaxation-notice';
    document.getElementById('top-picks-container').before(el);
  }
  if (state.matchTier===1) { el.innerHTML=''; return; }

  const tierMsg = state.matchTier===2
    ? 'Your requirements were strict — fewer than 3 exact matches were found.'
    : 'No strict matches found — showing closest alternatives from the full knowledge base.';
  const relaxedStr = state.relaxedFields.length ? state.relaxedFields.join(', ') : 'secondary constraints';

  el.innerHTML=`
    <div class="mb-5 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
      <div class="flex items-start gap-3">
        <span class="text-amber-400 text-lg shrink-0">🔄</span>
        <div>
          <p class="text-amber-300 font-semibold text-sm mb-1">Constraint Relaxation Applied</p>
          <p class="text-amber-200/70 text-xs leading-relaxed">${tierMsg} The inference engine relaxed: <strong>${relaxedStr}</strong>. Results below are the best available matches with explanation of any mismatches.</p>
        </div>
      </div>
    </div>`;
}

// ============================================================
// TOP 3 PANEL
// ============================================================
function renderTopThreePicks(overall,budget,perf) {
  const picks=[
    {label:'🏆 Best Overall Match',laptop:overall,color:'violet'},
    {label:'💰 Best Budget Match',laptop:budget,color:'emerald'},
    {label:'⚡ Best Performance',laptop:perf,color:'cyan'},
  ];
  return `<div class="mb-8 p-5 glass-card rounded-2xl border border-violet-500/20">
    <h3 class="text-lg font-bold mb-1 gradient-text">Expert System Top 3 Recommendations</h3>
    <p class="text-xs text-slate-500 mb-4">Inference engine identified these as strongest matches across three evaluation categories.</p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      ${picks.map(({label,laptop,color})=>{
        if(!laptop)return'';
        const mq=matchQualityLabel(laptop.confidence);
        return`<div class="p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20">
          <p class="text-[10px] font-bold text-${color}-400 uppercase tracking-wider mb-1">${label}</p>
          <p class="font-bold text-white text-sm leading-tight">${laptop.name}</p>
          <div class="flex items-center gap-2 mt-1.5">
            <span class="text-emerald-400 font-bold text-sm">€${laptop.priceEUR.toLocaleString()}</span>
            <span class="text-slate-500 text-xs">/ £${Math.round(laptop.priceEUR*EUR_TO_GBP)}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs ${mq.color} font-semibold">${mq.label}</span>
            <span class="text-xs text-slate-500">${laptop.confidence}%</span>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

// ============================================================
// IMAGE FALLBACK (4-tier via data-fallbacks)
// ============================================================
function imageHtml(laptop) {
  const fallbacks=[laptop.brandFallbackImage,laptop.categoryFallbackImage,laptop.defaultFallbackImage].filter(Boolean).join('|');
  return `<img src="${laptop.image}" alt="${laptop.name}"
    class="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
    data-fallbacks="${fallbacks}"
    onerror="handleImageError(this)" loading="lazy">`;
}
function handleImageError(img) {
  const list=(img.dataset.fallbacks||'').split('|').filter(Boolean);
  if(!list.length){img.onerror=null;return;}
  img.src=list[0];
  img.dataset.fallbacks=list.slice(1).join('|');
}

// ============================================================
// LAPTOP CARD
// ============================================================
function renderLaptopCard(laptop,rank) {
  const gbp=Math.round(laptop.priceEUR*EUR_TO_GBP);
  const sc=getScoreClass(laptop.valueScore);
  const bc=BADGE_COLORS[laptop.badgeColor]||BADGE_COLORS.slate;
  const mq=matchQualityLabel(laptop.confidence);
  const confColor=laptop.confidence>=80?'text-emerald-400':laptop.confidence>=60?'text-blue-400':'text-amber-400';
  const confBg=laptop.confidence>=80?'bg-emerald-400':laptop.confidence>=60?'bg-blue-400':'bg-amber-400';
  const isTop=rank===0;

  const amzDe=laptop.links?.amazonde||`https://www.amazon.de/s?k=${encodeURIComponent(laptop.name)}&i=computers`;
  const amzEs=laptop.links?.amazones||`https://www.amazon.es/s?k=${encodeURIComponent(laptop.name)}&i=computers`;
  const mm=laptop.links?.mediamarkt||`https://www.mediamarkt.de/de/search.html?query=${encodeURIComponent(laptop.name)}`;

  const badgesHtml=(laptop.badges||[]).slice(0,4).map(b=>
    `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">${b}</span>`).join('');
  const warnsHtml=(laptop.warnings||[]).slice(0,3).map(w=>
    `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">${w}</span>`).join('');
  const rulesHtml=(laptop.activatedRules||[]).slice(0,4).map(r=>
    `<div class="flex items-start gap-1.5 text-[10px] leading-relaxed ${r.matched?'text-slate-300':'text-slate-500'}">
      <span class="shrink-0 mt-px">${r.matched?'✓':'✗'}</span>
      <span>[${r.id}] ${r.reason}</span>
    </div>`).join('');

  return `<div class="laptop-card glass-card rounded-2xl overflow-hidden flex flex-col" data-id="${laptop.id}">
    <!-- Badge row -->
    <div class="flex items-start justify-between px-4 pt-4 pb-0 gap-2">
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${bc}">
        ${isTop?'⭐ ':''}${laptop.badge}
      </span>
      <div class="flex flex-col items-center shrink-0">
        <div class="value-ring ${sc}"><span class="text-[11px] font-black leading-none">${laptop.valueScore}</span></div>
        <span class="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wide">Value</span>
      </div>
    </div>

    <!-- Match quality + confidence -->
    <div class="mx-4 mt-2">
      <div class="flex items-center justify-between mb-1">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${mq.bg} ${mq.color}">${mq.label}</span>
        <span class="text-[11px] font-bold ${confColor}">${laptop.confidence}%</span>
      </div>
      <div class="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
        <div class="h-full ${confBg} rounded-full" style="width:${laptop.confidence}%"></div>
      </div>
    </div>

    <!-- Image -->
    <div class="mx-4 mt-3 rounded-xl overflow-hidden h-44 bg-slate-800/50 shrink-0">${imageHtml(laptop)}</div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-grow min-h-0">
      <div class="mb-3">
        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-medium">${laptop.brand}</p>
        <h3 class="text-base font-bold leading-tight mt-0.5 text-white">${laptop.name}</h3>
      </div>
      <div class="flex items-baseline gap-2 mb-4">
        <span class="text-2xl font-extrabold text-emerald-400">€${laptop.priceEUR.toLocaleString()}</span>
        <span class="text-sm text-slate-500">/ £${gbp.toLocaleString()}</span>
      </div>
      <div class="grid grid-cols-2 gap-x-3 gap-y-2 mb-4 text-xs">
        ${specItem('CPU',laptop.specs.cpu)}${specItem('GPU',laptop.specs.gpu)}
        ${specItem('RAM',laptop.specs.ramDisplay)}${specItem('Storage',laptop.specs.storage)}
        ${specItem('Display',laptop.specs.display)}${specItem('Weight',laptop.specs.weightDisplay)}
        ${specItem('Battery',laptop.specs.battery)}${specItem('OS',laptop.specs.os==='macos'?'macOS':'Windows 11')}
      </div>
      ${badgesHtml?`<div class="flex flex-wrap gap-1 mb-2">${badgesHtml}</div>`:''}
      ${warnsHtml?`<div class="flex flex-wrap gap-1 mb-3">${warnsHtml}</div>`:''}

      <!-- Inference reasoning -->
      <details class="mb-2">
        <summary class="cursor-pointer text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 select-none list-none">
          <span class="why-arrow">▶</span> Inference Engine Reasoning
        </summary>
        <div class="mt-2 text-xs text-slate-300 leading-relaxed bg-violet-500/10 rounded-xl p-3 border border-violet-500/20 space-y-2">
          <p>${generateDetailedReasoning(laptop)}</p>
          ${rulesHtml?`<div class="border-t border-violet-500/20 pt-2">
            <p class="text-[10px] text-violet-400 font-bold mb-1 uppercase tracking-wide">Activated Rules:</p>
            <div class="space-y-0.5">${rulesHtml}</div>
          </div>`:''}
        </div>
      </details>

      <!-- Pros / Cons -->
      <details class="mb-3">
        <summary class="cursor-pointer text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 select-none list-none">
          <span class="why-arrow">▶</span> Pros &amp; Cons · Expert Notes
        </summary>
        <div class="mt-2 text-xs rounded-xl p-3 bg-slate-800/50 border border-white/5 space-y-3">
          <div>
            <p class="text-emerald-400 font-bold mb-1">Pros</p>
            ${laptop.pros.map(p=>`<div class="flex gap-1.5 text-slate-300 mb-0.5"><span class="text-emerald-400 shrink-0">+</span>${p}</div>`).join('')}
          </div>
          <div>
            <p class="text-red-400 font-bold mb-1">Cons</p>
            ${laptop.cons.map(c=>`<div class="flex gap-1.5 text-slate-400 mb-0.5"><span class="text-red-400 shrink-0">−</span>${c}</div>`).join('')}
          </div>
          <div class="border-t border-white/5 pt-2">
            <p class="text-slate-500 font-bold mb-1">Expert Note</p>
            <p class="text-slate-400 leading-relaxed">${laptop.expertNotes}</p>
          </div>
          <div class="border-t border-white/5 pt-2">
            <p class="text-slate-500 font-bold mb-1">User Feedback</p>
            <p class="text-slate-400 leading-relaxed">${laptop.userFeedback}</p>
          </div>
        </div>
      </details>

      <!-- Compare toggle -->
      <label class="flex items-center gap-2 mb-4 cursor-pointer group/check select-none">
        <div class="compare-toggle w-4 h-4 rounded border border-slate-600 flex items-center justify-center transition-all shrink-0">
          <span class="check-mark text-[10px] hidden text-violet-300">✓</span>
        </div>
        <input type="checkbox" class="compare-checkbox sr-only" data-id="${laptop.id}" onchange="handleCompareToggle(this)">
        <span class="text-xs text-slate-500 group-hover/check:text-slate-300 transition-colors">Add to comparison</span>
      </label>

      <!-- Buy buttons -->
      <div class="mt-auto grid grid-cols-3 gap-1.5">
        <a href="${amzDe}" target="_blank" rel="noopener" class="buy-btn"><span class="block text-[9px] text-slate-500 leading-none mb-0.5">Amazon</span><span class="font-bold text-xs">.de</span></a>
        <a href="${amzEs}" target="_blank" rel="noopener" class="buy-btn"><span class="block text-[9px] text-slate-500 leading-none mb-0.5">Amazon</span><span class="font-bold text-xs">.es</span></a>
        <a href="${mm}" target="_blank" rel="noopener" class="buy-btn buy-btn-mm"><span class="block text-[9px] text-slate-500 leading-none mb-0.5">Media</span><span class="font-bold text-xs">Markt</span></a>
      </div>
    </div>
  </div>`;
}

function specItem(label,value) {
  return `<div class="spec-item"><span class="text-slate-500 block leading-none mb-0.5">${label}</span><span class="text-slate-200 font-medium leading-tight">${value}</span></div>`;
}

// ============================================================
// DETAILED REASONING
// ============================================================
function generateDetailedReasoning(laptop) {
  const a=state.answers; const parts=[];
  const pm={gaming:'gaming and high performance',programming:'software development',content:'video/photo editing and design',student:'student and daily use',office:'office productivity',business:'business and professional use'};
  if (a.purpose) parts.push(`Primary use case: <strong>${pm[a.purpose]||a.purpose}</strong>.`);
  if (a.budget) {
    const diff=a.budget-laptop.priceEUR;
    parts.push(diff>=0?`Costs €${laptop.priceEUR} — <strong>€${diff} under budget</strong>.`:`Costs €${laptop.priceEUR} — <strong>€${Math.abs(diff)} above budget</strong>, but upgraded specs may justify the difference.`);
  }
  if (a.gpu==='yes'&&laptop.hasGpu) parts.push(`Dedicated GPU (${laptop.specs.gpu}) required and matched.`);
  if (a.gpu==='yes'&&!laptop.hasGpu) parts.push(`You requested a dedicated GPU — this laptop has integrated graphics only.`);
  if (a.battery==='yes') parts.push(`Long battery required — this laptop provides <strong>~${laptop.specs.batteryHours}h</strong>.`);
  if (a.portability==='travel') parts.push(`Travel portability required — this laptop weighs <strong>${laptop.specs.weightDisplay}</strong>.`);
  if (a.vmUse==='yes') parts.push(`VM use selected — <strong>${laptop.specs.ramDisplay}</strong> available for concurrent environments.`);
  if (state.matchTier>1) parts.push(`<em>This result was found after constraint relaxation (Tier ${state.matchTier}).</em>`);
  parts.push(`Confidence score: <strong>${laptop.confidence}%</strong> — ${matchQualityLabel(laptop.confidence).label}.`);
  return parts.join(' ');
}

function getScoreClass(s){return s>=9.0?'score-green':s>=8.0?'score-blue':s>=7.0?'score-yellow':'score-orange';}

// ============================================================
// COMPARISON
// ============================================================
function handleCompareToggle(cb) {
  const id=cb.dataset.id;
  if (cb.checked){if(state.compareList.length>=3){cb.checked=false;return;}state.compareList.push(id);setCompareCheckbox(cb,true);}
  else{state.compareList=state.compareList.filter(i=>i!==id);setCompareCheckbox(cb,false);}
  updateCompareBar();
}
function setCompareCheckbox(cb,on){
  const lbl=cb.closest('label');if(!lbl)return;
  const tg=lbl.querySelector('.compare-toggle'),cm=lbl.querySelector('.check-mark');
  if(on){tg.classList.add('bg-violet-600','border-violet-500');cm.classList.remove('hidden');cb.checked=true;}
  else{tg.classList.remove('bg-violet-600','border-violet-500');cm.classList.add('hidden');cb.checked=false;}
}
function updateCompareBar(){
  const bar=document.getElementById('compare-bar'),slots=document.getElementById('compare-slots'),btn=document.getElementById('open-compare-btn');
  if(!state.compareList.length){bar.classList.add('hidden');return;}
  bar.classList.remove('hidden');
  slots.innerHTML=state.compareList.map(id=>{const l=KNOWLEDGE_BASE.find(x=>x.id===id);if(!l)return'';
    return`<div class="flex items-center gap-1.5 bg-slate-800 rounded-lg px-2.5 py-1.5"><span class="text-xs text-slate-200 max-w-[120px] truncate">${l.name}</span><button class="text-slate-500 hover:text-white text-xs ml-1" onclick="removeFromCompare('${id}')">✕</button></div>`;
  }).join('');
  btn.disabled=state.compareList.length<2;
  btn.textContent=state.compareList.length<2?`Select ${2-state.compareList.length} more`:'Compare Side-by-Side →';
}
function removeFromCompare(id){state.compareList=state.compareList.filter(i=>i!==id);const cb=document.querySelector(`.compare-checkbox[data-id="${id}"]`);if(cb)setCompareCheckbox(cb,false);updateCompareBar();}
function clearCompare(){state.compareList.forEach(id=>{const cb=document.querySelector(`.compare-checkbox[data-id="${id}"]`);if(cb)setCompareCheckbox(cb,false);});state.compareList=[];updateCompareBar();}
function openCompareModal(){if(state.compareList.length<2)return;renderCompareTable();document.getElementById('compare-modal').classList.remove('hidden');document.body.style.overflow='hidden';}
function closeCompareModal(){document.getElementById('compare-modal').classList.add('hidden');document.body.style.overflow='';}

function renderCompareTable(){
  const laptops=state.compareList.map(id=>{const b=KNOWLEDGE_BASE.find(l=>l.id===id),r=state.results.find(l=>l.id===id);return r||b;}).filter(Boolean);
  const rows=[
    {label:'Brand',get:l=>l.brand},
    {label:'Price (EUR)',get:l=>`<span class="text-emerald-400 font-bold">€${l.priceEUR.toLocaleString()}</span>`},
    {label:'Price (GBP)',get:l=>`£${Math.round(l.priceEUR*EUR_TO_GBP).toLocaleString()}`},
    {label:'Expert Score',get:l=>`${l.valueScore}/10`},
    {label:'Confidence',get:l=>l.confidence?`<span class="font-bold text-violet-400">${l.confidence}%</span>`:'—'},
    {label:'Match Quality',get:l=>l.confidence?`<span class="${matchQualityLabel(l.confidence).color} font-semibold">${matchQualityLabel(l.confidence).label}</span>`:'—'},
    {label:'CPU',get:l=>l.specs.cpu},{label:'GPU',get:l=>l.specs.gpu},
    {label:'RAM',get:l=>l.specs.ramDisplay},{label:'Storage',get:l=>l.specs.storage},
    {label:'Display',get:l=>l.specs.display},{label:'Weight',get:l=>l.specs.weightDisplay},
    {label:'Battery',get:l=>l.specs.battery},{label:'Build',get:l=>l.specs.buildQuality},
    {label:'RAM Upgradeable',get:l=>l.specs.upgradeableRam?'✓ Yes':'✗ Soldered'},
    {label:'OS',get:l=>l.specs.os==='macos'?'macOS':'Windows 11'},
    {label:'Best For',get:l=>l.bestFor.slice(0,2).join(', ')},
    {label:'Buy Links',get:l=>`<div class="flex flex-col gap-1"><a href="${l.links?.amazonde||''}" target="_blank" class="text-xs text-violet-400 hover:text-white underline">Amazon.de →</a><a href="${l.links?.amazones||''}" target="_blank" class="text-xs text-violet-400 hover:text-white underline">Amazon.es →</a><a href="${l.links?.mediamarkt||''}" target="_blank" class="text-xs text-violet-400 hover:text-white underline">MediaMarkt →</a></div>`},
  ];
  const cw=laptops.length===2?'w-1/2':'w-1/3';
  document.getElementById('compare-table-container').innerHTML=`
    <table class="w-full text-sm compare-table"><thead><tr class="border-b border-white/10">
      <th class="text-left text-slate-500 text-xs uppercase py-3 pr-4 w-28">Spec</th>
      ${laptops.map(l=>`<th class="text-left py-3 px-3 ${cw}"><p class="text-[10px] text-slate-500 uppercase">${l.brand}</p><p class="font-bold text-white text-sm">${l.name}</p><span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${BADGE_COLORS[l.badgeColor]||BADGE_COLORS.slate}">${l.badge}</span></th>`).join('')}
    </tr></thead><tbody>
      ${rows.map((row,i)=>`<tr class="border-b border-white/5 ${i%2===0?'bg-white/[0.02]':''}"><td class="text-slate-500 text-xs font-medium py-3 pr-4 align-top">${row.label}</td>${laptops.map(l=>`<td class="py-3 px-3 text-slate-200 text-xs align-top">${row.get(l)}</td>`).join('')}</tr>`).join('')}
    </tbody></table>`;
}

// ============================================================
// RESTART
// ============================================================
function restartApp(){
  state.step=1;state.matchTier=1;state.relaxedFields=[];
  state.answers={budget:null,purpose:null,battery:null,portability:null,gaming:null,vmUse:null,ram:null,gpu:null,os:null,premium:null};
  state.results=[];state.compareList=[];
  document.getElementById('wizard-section').classList.remove('hidden');
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('restart-header-btn').classList.add('hidden');
  document.getElementById('compare-bar').classList.add('hidden');
  document.getElementById('top-picks-container').innerHTML='';
  const rn=document.getElementById('relaxation-notice');if(rn)rn.innerHTML='';
  closeCompareModal();renderProgressDots();renderStep(1);
}

init();
