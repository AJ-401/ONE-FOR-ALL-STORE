// Frontend-side product metadata mapping
// The PRODUCTS table has no image or badge columns, so we map by product_id here.
// Fully populated with 105 products (100 authentic Souled Store clothing items + 5 tech accessories).

const ID_IMAGE_MAP = {
  "101": "/products/mouse.jpg",
  "102": "/products/keyboard.jpg",
  "103": "/products/cable.jpg",
  "104": "/products/stand.jpg",
  "105": "/products/headphones.jpg",
  "106": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792476069_1921424.jpg?w=300&dpr=2",
  "107": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792475011_6590378.jpg?w=300&dpr=2",
  "108": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792490780_4173049.jpg?w=300&dpr=2",
  "109": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792407432_2271373.jpg?w=300&dpr=2",
  "110": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792601131_7921823.jpg?w=300&dpr=2",
  "111": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792215216_4709923.jpg?w=300&dpr=2",
  "112": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792595465_2473789.jpg?w=300&dpr=2",
  "113": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792217910_4203282.jpg?w=300&dpr=2",
  "114": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792217960_6020370.jpg?w=300&dpr=2",
  "115": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792652980_6378272.jpg?w=300&dpr=2",
  "116": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792215821_1075128.jpg?w=300&dpr=2",
  "117": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792216908_7901310.jpg?w=300&dpr=2",
  "118": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792217388_4703090.jpg?w=300&dpr=2",
  "119": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792232568_4128347.jpg?w=300&dpr=2",
  "120": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792136000_6719172.jpg?w=300&dpr=2",
  "121": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792148608_2329131.jpg?w=300&dpr=2",
  "122": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789134712_4789350.jpg?w=300&dpr=2",
  "123": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1783081914_3435976.jpg?w=300&dpr=2",
  "124": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1782887025_5445581.jpg?w=300&dpr=2",
  "125": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1788415534_8496135.jpg?w=300&dpr=2",
  "126": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1785321830_5410889.jpg?w=300&dpr=2",
  "127": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1742467430_5581901.jpg?w=300&dpr=2",
  "128": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1775750453_2022211.jpg?w=300&dpr=2",
  "129": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790069534_9369008.jpg?w=300&dpr=2",
  "130": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1774687842_6092050.jpg?w=300&dpr=2",
  "131": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791785413_7958827.jpg?w=300&dpr=2",
  "132": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789840985_7803602.jpg?w=300&dpr=2",
  "133": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789019613_5951212.jpg?w=300&dpr=2",
  "134": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791885181_8559295.jpg?w=300&dpr=2",
  "135": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790765493_4368538.jpg?w=300&dpr=2",
  "136": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1772866598_6741094.jpg?w=300&dpr=2",
  "137": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789841351_4158334.jpg?w=300&dpr=2",
  "138": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791440059_4800921.jpg?w=300&dpr=2",
  "139": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791307316_2078865.jpg?w=300&dpr=2",
  "140": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791454772_7796094.jpg?w=300&dpr=2",
  "141": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789562855_6738058.jpg?w=300&dpr=2",
  "142": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790142891_3351680.jpg?w=300&dpr=2",
  "143": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789644571_8452037.jpg?w=300&dpr=2",
  "144": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790062195_3149004.jpg?w=300&dpr=2",
  "145": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792143792_9177391.jpg?w=300&dpr=2",
  "146": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791801891_1899600.jpg?w=300&dpr=2",
  "147": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1773392795_6888793.jpg?w=300&dpr=2",
  "148": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790083588_5675182.jpg?w=300&dpr=2",
  "149": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790771038_6845499.jpg?w=300&dpr=2",
  "150": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790317229_2179416.jpg?w=300&dpr=2",
  "151": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789840625_6966567.jpg?w=300&dpr=2",
  "152": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791394839_6609447.jpg?w=300&dpr=2",
  "153": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791611616_1404183.jpg?w=300&dpr=2",
  "154": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1762924081_6872458.jpg?w=300&dpr=2",
  "155": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789839661_2667716.jpg?w=300&dpr=2",
  "156": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789636204_8605955.jpg?w=300&dpr=2",
  "157": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791549961_3951447.jpg?w=300&dpr=2",
  "158": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790578240_2315782.jpg?w=300&dpr=2",
  "159": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1776319064_7382882.jpg?w=300&dpr=2",
  "160": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789838622_5741799.jpg?w=300&dpr=2",
  "161": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790920797_3581225.jpg?w=300&dpr=2",
  "162": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791457692_6824395.jpg?w=300&dpr=2",
  "163": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790060565_7366776.jpg?w=300&dpr=2",
  "164": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1742976621_2256958.jpg?w=300&dpr=2",
  "165": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1788860161_9330895.jpg?w=300&dpr=2",
  "166": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790579473_2552408.jpg?w=300&dpr=2",
  "167": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1788959599_1926114.jpg?w=300&dpr=2",
  "168": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789194469_5767250.jpg?w=300&dpr=2",
  "169": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791185898_2054399.jpg?w=300&dpr=2",
  "170": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790578422_7124384.jpg?w=300&dpr=2",
  "171": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790764656_2054492.jpg?w=300&dpr=2",
  "172": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790061491_8902074.jpg?w=300&dpr=2",
  "173": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790578308_1469115.jpg?w=300&dpr=2",
  "174": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790577507_9262937.jpg?w=300&dpr=2",
  "175": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1788861075_9643635.jpg?w=300&dpr=2",
  "176": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790577452_9141666.jpg?w=300&dpr=2",
  "177": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790232273_1129624.jpg?w=300&dpr=2",
  "178": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789794554_8646427.jpg?w=300&dpr=2",
  "179": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791450783_6682593.jpg?w=300&dpr=2",
  "180": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790599638_4373473.jpg?w=300&dpr=2",
  "181": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789187107_3402358.jpg?w=300&dpr=2",
  "182": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790085950_6920693.jpg?w=300&dpr=2",
  "183": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792042333_8887475.jpg?w=300&dpr=2",
  "184": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789216958_3043836.jpg?w=300&dpr=2",
  "185": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790751410_8527762.jpg?w=300&dpr=2",
  "186": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792041987_1270623.jpg?w=300&dpr=2",
  "187": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1788934735_6884086.jpg?w=300&dpr=2",
  "188": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790597541_5555656.jpg?w=300&dpr=2",
  "189": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791979321_7111848.jpg?w=300&dpr=2",
  "190": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1759310420_4608008.jpg?w=300&dpr=2",
  "191": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791396928_4275643.jpg?w=300&dpr=2",
  "192": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790774567_1891744.jpg?w=300&dpr=2",
  "193": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790925298_5999491.jpg?w=300&dpr=2",
  "194": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789227777_4367050.jpg?w=300&dpr=2",
  "195": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791524977_7173922.jpg?w=300&dpr=2",
  "196": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792055417_8895083.jpg?w=300&dpr=2",
  "197": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1789813044_8414106.jpg?w=300&dpr=2",
  "198": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1790319415_9374635.jpg?w=300&dpr=2",
  "199": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1741861875_4077308.jpg?w=300&dpr=2",
  "200": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1791008430_6016474.jpg?w=300&dpr=2",
  "201": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792476069_1921424.jpg?w=300&dpr=2",
  "202": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792475011_6590378.jpg?w=300&dpr=2",
  "203": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792490780_4173049.jpg?w=300&dpr=2",
  "204": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792407432_2271373.jpg?w=300&dpr=2",
  "205": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1792601131_7921823.jpg?w=300&dpr=2"
};

const ID_BADGE_MAP = {
  "101": [
    "OFFICIAL MERCH",
    "BATMAN EDITION"
  ],
  "102": [
    "OFFICIAL MERCH",
    "MECHANICAL"
  ],
  "103": [
    "FAST CHARGE",
    "BRAIDED CABLE"
  ],
  "104": [
    "OFFICIAL MERCH",
    "DESK SETUP"
  ],
  "105": [
    "OFFICIAL MERCH",
    "NOISE ISOLATING"
  ],
  "106": [
    "OFFICIAL MERCH"
  ],
  "107": [
    "OFFICIAL MERCH"
  ],
  "108": [
    "OFFICIAL MERCH"
  ],
  "109": [
    "OFFICIAL MERCH"
  ],
  "110": [
    "OFFICIAL MERCH"
  ],
  "111": [
    "OFFICIAL MERCH"
  ],
  "112": [
    "OFFICIAL MERCH"
  ],
  "113": [
    "OFFICIAL MERCH"
  ],
  "114": [
    "OFFICIAL MERCH"
  ],
  "115": [
    "OFFICIAL MERCH"
  ],
  "116": [
    "OFFICIAL MERCH"
  ],
  "117": [
    "OFFICIAL MERCH"
  ],
  "118": [
    "OFFICIAL MERCH"
  ],
  "119": [
    "OFFICIAL MERCH"
  ],
  "120": [
    "OFFICIAL MERCH"
  ],
  "121": [
    "OFFICIAL MERCH"
  ],
  "122": [
    "OFFICIAL MERCH"
  ],
  "123": [
    "OFFICIAL MERCH"
  ],
  "124": [
    "OFFICIAL MERCH"
  ],
  "125": [
    "OFFICIAL MERCH"
  ],
  "126": [
    "OFFICIAL MERCH"
  ],
  "127": [
    "OFFICIAL MERCH"
  ],
  "128": [
    "OFFICIAL MERCH"
  ],
  "129": [
    "OFFICIAL MERCH"
  ],
  "130": [
    "OFFICIAL MERCH"
  ],
  "131": [
    "OFFICIAL MERCH"
  ],
  "132": [
    "OFFICIAL MERCH"
  ],
  "133": [
    "OFFICIAL MERCH"
  ],
  "134": [
    "OFFICIAL MERCH"
  ],
  "135": [
    "OFFICIAL MERCH"
  ],
  "136": [
    "OFFICIAL MERCH"
  ],
  "137": [
    "OFFICIAL MERCH"
  ],
  "138": [
    "OFFICIAL MERCH"
  ],
  "139": [
    "OFFICIAL MERCH"
  ],
  "140": [
    "OFFICIAL MERCH"
  ],
  "141": [
    "OFFICIAL MERCH"
  ],
  "142": [
    "OFFICIAL MERCH"
  ],
  "143": [
    "OFFICIAL MERCH"
  ],
  "144": [
    "OFFICIAL MERCH"
  ],
  "145": [
    "OFFICIAL MERCH"
  ],
  "146": [
    "OFFICIAL MERCH"
  ],
  "147": [
    "OFFICIAL MERCH"
  ],
  "148": [
    "OFFICIAL MERCH"
  ],
  "149": [
    "OFFICIAL MERCH"
  ],
  "150": [
    "OFFICIAL MERCH"
  ],
  "151": [
    "OFFICIAL MERCH"
  ],
  "152": [
    "OFFICIAL MERCH"
  ],
  "153": [
    "OFFICIAL MERCH"
  ],
  "154": [
    "OFFICIAL MERCH"
  ],
  "155": [
    "OFFICIAL MERCH"
  ],
  "156": [
    "OFFICIAL MERCH"
  ],
  "157": [
    "OFFICIAL MERCH"
  ],
  "158": [
    "OFFICIAL MERCH"
  ],
  "159": [
    "OFFICIAL MERCH"
  ],
  "160": [
    "OFFICIAL MERCH"
  ],
  "161": [
    "OFFICIAL MERCH"
  ],
  "162": [
    "OFFICIAL MERCH"
  ],
  "163": [
    "OFFICIAL MERCH"
  ],
  "164": [
    "OFFICIAL MERCH"
  ],
  "165": [
    "OFFICIAL MERCH"
  ],
  "166": [
    "OFFICIAL MERCH"
  ],
  "167": [
    "OFFICIAL MERCH"
  ],
  "168": [
    "OFFICIAL MERCH"
  ],
  "169": [
    "OFFICIAL MERCH"
  ],
  "170": [
    "OFFICIAL MERCH"
  ],
  "171": [
    "OFFICIAL MERCH"
  ],
  "172": [
    "OFFICIAL MERCH"
  ],
  "173": [
    "OFFICIAL MERCH"
  ],
  "174": [
    "OFFICIAL MERCH"
  ],
  "175": [
    "OFFICIAL MERCH"
  ],
  "176": [
    "OFFICIAL MERCH"
  ],
  "177": [
    "OFFICIAL MERCH"
  ],
  "178": [
    "OFFICIAL MERCH"
  ],
  "179": [
    "OFFICIAL MERCH"
  ],
  "180": [
    "OFFICIAL MERCH"
  ],
  "181": [
    "OFFICIAL MERCH"
  ],
  "182": [
    "OFFICIAL MERCH"
  ],
  "183": [
    "OFFICIAL MERCH"
  ],
  "184": [
    "OFFICIAL MERCH"
  ],
  "185": [
    "OFFICIAL MERCH"
  ],
  "186": [
    "OFFICIAL MERCH"
  ],
  "187": [
    "OFFICIAL MERCH"
  ],
  "188": [
    "OFFICIAL MERCH"
  ],
  "189": [
    "OFFICIAL MERCH"
  ],
  "190": [
    "OFFICIAL MERCH"
  ],
  "191": [
    "OFFICIAL MERCH"
  ],
  "192": [
    "OFFICIAL MERCH"
  ],
  "193": [
    "OFFICIAL MERCH"
  ],
  "194": [
    "OFFICIAL MERCH"
  ],
  "195": [
    "OFFICIAL MERCH"
  ],
  "196": [
    "OFFICIAL MERCH"
  ],
  "197": [
    "OFFICIAL MERCH"
  ],
  "198": [
    "OFFICIAL MERCH"
  ],
  "199": [
    "OFFICIAL MERCH"
  ],
  "200": [
    "OFFICIAL MERCH"
  ],
  "201": [
    "OFFICIAL MERCH"
  ],
  "202": [
    "OFFICIAL MERCH"
  ],
  "203": [
    "ANIME COLLECTION"
  ],
  "204": [
    "OFFICIAL MERCH"
  ],
  "205": [
    "OFFICIAL MERCH"
  ]
};

const ID_CATEGORY_MAP = {
  "101": "Tech Gear",
  "102": "Tech Gear",
  "103": "Tech Gear",
  "104": "Accessories",
  "105": "Audio",
  "106": "Oversized T-Shirts",
  "107": "Oversized T-Shirts",
  "108": "Super Oversized T-Shirts",
  "109": "Oversized Polos",
  "110": "Oversized Jerseys",
  "111": "Classic Polos",
  "112": "Easy Fit Vests",
  "113": "Oversized T-Shirts",
  "114": "Men Classic Fit T-Shirts",
  "115": "Oversized T-Shirts",
  "116": "Super Oversized T-Shirts",
  "117": "Oversized Polos",
  "118": "Oversized T-Shirts",
  "119": "Oversized T-Shirts",
  "120": "Oversized Polos",
  "121": "Oversized T-Shirts",
  "122": "Oversized T-Shirts",
  "123": "Oversized T-Shirts",
  "124": "T-Shirts",
  "125": "Super Oversized T-Shirts",
  "126": "Oversized T-Shirts",
  "127": "Oversized T-Shirts",
  "128": "Oversized T-Shirts",
  "129": "Oversized Full Sleeve T-Shirts",
  "130": "Oversized T-Shirts",
  "131": "Oversized T-Shirts",
  "132": "Men Classic Fit T-Shirts",
  "133": "Oversized Full Sleeve T-Shirts",
  "134": "Oversized Polos",
  "135": "Oversized T-Shirts",
  "136": "Textured Polos",
  "137": "Men Classic Fit T-Shirts",
  "138": "Oversized T-Shirts",
  "139": "Oversized Jerseys",
  "140": "Oversized T-Shirts",
  "141": "Oversized T-Shirts",
  "142": "Oversized T-Shirts",
  "143": "Oversized Full Sleeve T-Shirts",
  "144": "Oversized T-Shirts",
  "145": "Oversized Full Sleeve T-Shirts",
  "146": "Oversized T-Shirts",
  "147": "Oversized Polos",
  "148": "Super Oversized T-Shirts",
  "149": "Oversized T-Shirts",
  "150": "Oversized T-Shirts",
  "151": "Men Classic Fit T-Shirts",
  "152": "Oversized Polos",
  "153": "Oversized T-Shirts",
  "154": "Oversized T-Shirts",
  "155": "Oversized Full Sleeve T-Shirts",
  "156": "Oversized T-Shirts",
  "157": "Oversized Full Sleeve T-Shirts",
  "158": "Men Relaxed Fit T-Shirts",
  "159": "Oversized T-Shirts",
  "160": "Men Classic Fit T-Shirts",
  "161": "Oversized T-Shirts",
  "162": "Oversized T-Shirts",
  "163": "Men Boxy Fit T-Shirts",
  "164": "Super Oversized T-Shirts",
  "165": "Oversized T-Shirts",
  "166": "Men Relaxed Fit T-Shirts",
  "167": "Men Boxy Fit T-Shirts",
  "168": "Oversized T-Shirts",
  "169": "Men Relaxed Fit T-Shirts",
  "170": "Men Relaxed Fit T-Shirts",
  "171": "Men Classic Fit T-Shirts",
  "172": "Oversized T-Shirts",
  "173": "Men Relaxed Fit T-Shirts",
  "174": "Men Relaxed Fit T-Shirts",
  "175": "Oversized T-Shirts",
  "176": "Men Relaxed Fit T-Shirts",
  "177": "Oversized Jerseys",
  "178": "Men Relaxed Fit T-Shirts",
  "179": "Oversized T-Shirts",
  "180": "Men Relaxed Fit T-Shirts",
  "181": "Oversized T-Shirts",
  "182": "Vests",
  "183": "Textured Polos",
  "184": "Polo Vests",
  "185": "Oversized Jerseys",
  "186": "Textured Polos",
  "187": "Oversized T-Shirts",
  "188": "Oversized T-Shirts",
  "189": "Oversized T-Shirts",
  "190": "Men Relaxed Fit T-Shirts",
  "191": "Oversized Full Sleeve Polos",
  "192": "Oversized T-Shirts",
  "193": "Oversized T-Shirts",
  "194": "Oversized T-Shirts",
  "195": "Oversized T-Shirts",
  "196": "Oversized Polos",
  "197": "V-Neck T-Shirts",
  "198": "Oversized Polos",
  "199": "Drop Cut T-Shirts",
  "200": "Men Boxy Fit T-Shirts",
  "201": "Oversized T-Shirts",
  "202": "Oversized T-Shirts",
  "203": "Oversized Hoodies",
  "204": "Classic T-Shirts",
  "205": "Oversized Polos"
};

const FALLBACK_IMAGES = [
  '/products/tshirt.jpg',
  '/products/hoodie.jpg',
  '/products/jacket.jpg',
  '/products/joggers.jpg',
  '/products/sneakers.jpg',
];

export function getProductImage(product, index = 0) {
  if (!product) return FALLBACK_IMAGES[0];
  const id = product.product_id;
  if (id && ID_IMAGE_MAP[id]) {
    return ID_IMAGE_MAP[id];
  }
  return FALLBACK_IMAGES[(id || index) % FALLBACK_IMAGES.length];
}

export function getProductBadges(product) {
  if (!product) return ['OFFICIAL MERCH'];
  const id = product.product_id;
  if (id && ID_BADGE_MAP[id]) {
    return ID_BADGE_MAP[id];
  }
  return ['OFFICIAL MERCH'];
}

export function getProductCategory(product) {
  if (!product) return 'Official Merch';
  const id = product.product_id;
  if (id && ID_CATEGORY_MAP[id]) {
    return ID_CATEGORY_MAP[id];
  }
  return 'Official Merch';
}
