const bcrypt = require("bcryptjs");

const now = new Date().toISOString();

const products = [
  {
    _id: "p1",
    name: "Core Oversized Hoodie",
    category: "hoodie",
    price: 139,
    description: "Heavyweight cotton hoodie with brushed interior and relaxed fit.",
    images: [
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Gray", "Sand"],
    sizes: ["S", "M", "L", "XL"],
    stock: 42,
    isNew: true,
    featured: true,
    popularity: 92,
    createdAt: now
  },
  {
    _id: "p2",
    name: "Essential Heavy Tee",
    category: "t-shirt",
    price: 58,
    description: "Structured heavyweight tee cut for a premium drape.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["White", "Black", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    stock: 64,
    isNew: false,
    featured: true,
    popularity: 86,
    createdAt: "2026-02-20T10:00:00.000Z"
  },
  {
    _id: "p3",
    name: "Urban Cargo Pants",
    category: "pants",
    price: 118,
    description: "Tapered cargo pants with articulated knees and matte finish.",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Navy", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    stock: 35,
    isNew: true,
    featured: false,
    popularity: 75,
    createdAt: "2026-02-28T10:00:00.000Z"
  },
  {
    _id: "p4",
    name: "Aero Shell Jacket",
    category: "jacket",
    price: 229,
    description: "Water-resistant shell jacket designed for fast city transitions.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    stock: 21,
    isNew: true,
    featured: true,
    popularity: 89,
    createdAt: "2026-03-01T10:00:00.000Z"
  },
  {
    _id: "p5",
    name: "Motion Sneakers",
    category: "sneakers",
    price: 184,
    description: "Everyday performance sneakers with responsive foam cushioning.",
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["White", "Black"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 29,
    isNew: false,
    featured: true,
    popularity: 97,
    createdAt: "2026-02-15T10:00:00.000Z"
  },
  {
    _id: "p6",
    name: "Utility Cap",
    category: "accessories",
    price: 39,
    description: "Minimal curved-brim cap with tonal logo embroidery.",
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Sand"],
    sizes: ["One Size"],
    stock: 100,
    isNew: true,
    featured: false,
    popularity: 63,
    createdAt: "2026-03-03T10:00:00.000Z"
  },
  {
    _id: "p7",
    name: "Studio Rib Tank",
    category: "t-shirt",
    price: 46,
    description: "Slim rib tank built for layering and clean summer silhouettes.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["White", "Black", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    stock: 56,
    isNew: false,
    featured: false,
    popularity: 67,
    createdAt: "2026-02-10T10:00:00.000Z"
  },
  {
    _id: "p8",
    name: "Summit Puffer Vest",
    category: "jacket",
    price: 168,
    description: "Light insulated vest with matte technical shell and hidden pockets.",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Olive", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    stock: 27,
    isNew: true,
    featured: true,
    popularity: 83,
    createdAt: "2026-03-04T10:00:00.000Z"
  },
  {
    _id: "p9",
    name: "Transit Wide Pants",
    category: "pants",
    price: 132,
    description: "Wide-leg city pants with refined drape and crease-resistant fabric.",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Navy", "Sand"],
    sizes: ["S", "M", "L", "XL"],
    stock: 31,
    isNew: true,
    featured: false,
    popularity: 78,
    createdAt: "2026-03-02T12:30:00.000Z"
  },
  {
    _id: "p10",
    name: "Peak Runner Knit",
    category: "sneakers",
    price: 199,
    description: "Breathable knit runner with premium heel support and soft rebound.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["White", "Black", "Gray"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 38,
    isNew: true,
    featured: true,
    popularity: 94,
    createdAt: "2026-03-05T09:00:00.000Z"
  },
  {
    _id: "p11",
    name: "Minimal Crossbody",
    category: "accessories",
    price: 74,
    description: "Compact crossbody bag with structured form and magnetic closure.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Gray", "Sand"],
    sizes: ["One Size"],
    stock: 48,
    isNew: false,
    featured: false,
    popularity: 71,
    createdAt: "2026-01-27T08:00:00.000Z"
  },
  {
    _id: "p12",
    name: "Alpine Zip Hoodie",
    category: "hoodie",
    price: 149,
    description: "Zip hoodie in brushed fleece with elevated hardware and tonal trim.",
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    stock: 44,
    isNew: false,
    featured: true,
    popularity: 88,
    createdAt: "2026-02-12T11:15:00.000Z"
  },
  {
    _id: "p13",
    name: "Stone Relaxed Hoodie",
    category: "hoodie",
    price: 134,
    description: "Relaxed fleece hoodie with tonal drawcord and clean cuffs.",
    images: [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Sand", "Gray", "Black"],
    sizes: ["S", "M", "L", "XL"],
    stock: 53,
    isNew: true,
    featured: false,
    popularity: 80,
    createdAt: "2026-03-05T12:00:00.000Z"
  },
  {
    _id: "p14",
    name: "Gridline Tech Tee",
    category: "t-shirt",
    price: 62,
    description: "Breathable performance tee with soft touch and quick dry build.",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "White", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    stock: 72,
    isNew: false,
    featured: true,
    popularity: 82,
    createdAt: "2026-02-26T08:30:00.000Z"
  },
  {
    _id: "p15",
    name: "Contour Pleated Pants",
    category: "pants",
    price: 146,
    description: "Pleated wide pants with modern tailoring and matte finish.",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Sand"],
    sizes: ["S", "M", "L", "XL"],
    stock: 28,
    isNew: true,
    featured: true,
    popularity: 90,
    createdAt: "2026-03-03T14:10:00.000Z"
  },
  {
    _id: "p16",
    name: "North Windbreaker",
    category: "jacket",
    price: 214,
    description: "Packable windbreaker with seam-sealed design for rainy commutes.",
    images: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Navy", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    stock: 19,
    isNew: false,
    featured: false,
    popularity: 73,
    createdAt: "2026-01-22T09:45:00.000Z"
  },
  {
    _id: "p17",
    name: "Velocity Street Sneaker",
    category: "sneakers",
    price: 176,
    description: "Street runner silhouette with dense foam and durable outsole.",
    images: [
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["White", "Gray", "Black"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 41,
    isNew: true,
    featured: true,
    popularity: 91,
    createdAt: "2026-03-06T06:30:00.000Z"
  },
  {
    _id: "p18",
    name: "Monochrome Crew Socks",
    category: "accessories",
    price: 22,
    description: "Combed cotton socks with arch support and minimal logo knit.",
    images: [
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["White", "Black", "Gray"],
    sizes: ["M", "L"],
    stock: 130,
    isNew: false,
    featured: false,
    popularity: 58,
    createdAt: "2026-02-01T07:20:00.000Z"
  },
  {
    _id: "p19",
    name: "Metro Zip Sweatshirt",
    category: "hoodie",
    price: 128,
    description: "Half-zip sweatshirt with brushed interior and structured collar.",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    stock: 36,
    isNew: false,
    featured: false,
    popularity: 69,
    createdAt: "2026-02-17T16:10:00.000Z"
  },
  {
    _id: "p20",
    name: "Fitted Core Tee",
    category: "t-shirt",
    price: 54,
    description: "Fitted premium jersey tee with stable neckline and soft handfeel.",
    images: [
      "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["White", "Black", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    stock: 67,
    isNew: true,
    featured: false,
    popularity: 77,
    createdAt: "2026-03-04T11:40:00.000Z"
  },
  {
    _id: "p21",
    name: "Atlas Utility Pants",
    category: "pants",
    price: 154,
    description: "Utility straight pants with side cargo pockets and stretch weave.",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Olive", "Black", "Sand"],
    sizes: ["S", "M", "L", "XL"],
    stock: 26,
    isNew: true,
    featured: true,
    popularity: 87,
    createdAt: "2026-03-06T09:10:00.000Z"
  },
  {
    _id: "p22",
    name: "Cloud Down Jacket",
    category: "jacket",
    price: 248,
    description: "Premium insulated jacket with lightweight loft and matte shell.",
    images: [
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    stock: 14,
    isNew: true,
    featured: true,
    popularity: 95,
    createdAt: "2026-03-06T10:20:00.000Z"
  },
  {
    _id: "p23",
    name: "Trail Motion Sneaker",
    category: "sneakers",
    price: 188,
    description: "Trail-inspired sneaker with grip outsole and supportive heel lock.",
    images: [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "White", "Olive"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 33,
    isNew: false,
    featured: true,
    popularity: 84,
    createdAt: "2026-02-19T10:00:00.000Z"
  },
  {
    _id: "p24",
    name: "Leather Minimal Belt",
    category: "accessories",
    price: 52,
    description: "Italian leather belt with brushed buckle and minimal edge finish.",
    images: [
      "https://images.unsplash.com/photo-1611923134239-b9be5816e9f1?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Brown"],
    sizes: ["S", "M", "L"],
    stock: 54,
    isNew: false,
    featured: false,
    popularity: 65,
    createdAt: "2026-01-30T13:55:00.000Z"
  },
  {
    _id: "p25",
    name: "Ivory Studio Hoodie",
    category: "hoodie",
    price: 162,
    description: "Premium ivory hoodie with boxy fit and smooth fleece texture.",
    images: [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["White", "Gray", "Black"],
    sizes: ["S", "M", "L", "XL"],
    stock: 22,
    isNew: true,
    featured: true,
    popularity: 96,
    createdAt: "2026-03-06T12:00:00.000Z"
  },
  {
    _id: "p26",
    name: "White Core Performance Tee",
    category: "t-shirt",
    price: 76,
    description: "Crisp white premium tee with reinforced collar and tailored sleeve.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["White", "Black"],
    sizes: ["S", "M", "L", "XL"],
    stock: 47,
    isNew: true,
    featured: true,
    popularity: 92,
    createdAt: "2026-03-06T12:15:00.000Z"
  },
  {
    _id: "p27",
    name: "Glacier Tech Bomber",
    category: "jacket",
    price: 242,
    description: "All-weather bomber in glacier white with refined matte shell.",
    images: [
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["White", "Black", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    isNew: true,
    featured: true,
    popularity: 94,
    createdAt: "2026-03-06T12:30:00.000Z"
  },
  {
    _id: "p28",
    name: "Urban Longsleeve Core",
    category: "longsleeve",
    price: 94,
    description: "Premium long sleeve with dense cotton knit and structured fit.",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "White", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    stock: 39,
    isNew: true,
    featured: false,
    popularity: 84,
    createdAt: "2026-03-06T13:20:00.000Z"
  },
  {
    _id: "p29",
    name: "Metal Zip Layer",
    category: "zipper",
    price: 109,
    description: "Layered zipper top with clean hardware and structured cuffs.",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    stock: 33,
    isNew: true,
    featured: false,
    popularity: 79,
    createdAt: "2026-03-06T14:00:00.000Z"
  },
  {
    _id: "p30",
    name: "City Utility Bag",
    category: "bag",
    price: 124,
    description: "Structured city bag with clean silhouette and matte hardware.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Gray"],
    sizes: ["One Size"],
    stock: 27,
    isNew: true,
    featured: false,
    popularity: 76,
    createdAt: "2026-03-06T14:20:00.000Z"
  },
  {
    _id: "p31",
    name: "Silver Signet Ring",
    category: "ring",
    price: 89,
    description: "Polished signet ring with minimal face and premium metal finish.",
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Silver", "Black"],
    sizes: ["One Size"],
    stock: 34,
    isNew: true,
    featured: false,
    popularity: 74,
    createdAt: "2026-03-06T14:35:00.000Z"
  },
  {
    _id: "p32",
    name: "Studio Vinyl Toy",
    category: "toy",
    price: 64,
    description: "Collector vinyl toy with clean sculpt and matte premium finish.",
    images: [
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "White"],
    sizes: ["One Size"],
    stock: 23,
    isNew: true,
    featured: false,
    popularity: 71,
    createdAt: "2026-03-06T14:50:00.000Z"
  },
  {
    _id: "p33",
    name: "Signature Panel Hat",
    category: "hat",
    price: 52,
    description: "Structured panel hat with clean logo placement and curved brim.",
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Gray"],
    sizes: ["One Size"],
    stock: 41,
    isNew: true,
    featured: false,
    popularity: 69,
    createdAt: "2026-03-06T15:05:00.000Z"
  },
  {
    _id: "p34",
    name: "Urban Filter Mask",
    category: "mask",
    price: 34,
    description: "Minimal urban mask with clean paneling and soft inner lining.",
    images: [
      "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Gray"],
    sizes: ["One Size"],
    stock: 64,
    isNew: true,
    featured: false,
    popularity: 66,
    createdAt: "2026-03-06T15:20:00.000Z"
  },
  {
    _id: "p35",
    name: "Minimal Leather Belt",
    category: "belt",
    price: 57,
    description: "Minimal leather belt with clean matte buckle and premium finish.",
    images: [
      "https://images.unsplash.com/photo-1611923134239-b9be5816e9f1?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Brown"],
    sizes: ["S", "M", "L"],
    stock: 38,
    isNew: true,
    featured: false,
    popularity: 68,
    createdAt: "2026-03-06T15:40:00.000Z"
  },
  {
    _id: "p36",
    name: "Mono Frame Glasses",
    category: "glasses",
    price: 96,
    description: "Minimal frame glasses with clean silhouette and premium finish.",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: ["Black", "Silver"],
    sizes: ["One Size"],
    stock: 29,
    isNew: true,
    featured: false,
    popularity: 72,
    createdAt: "2026-03-06T16:00:00.000Z"
  }
];

const users = [
  {
    _id: "u_demo_1",
    name: "Demo User",
    email: "1",
    password: bcrypt.hashSync("1", 10),
    isAdmin: false
  },
  {
    _id: "u_admin",
    name: "Admin",
    email: "admin",
    password: bcrypt.hashSync("admin1", 10),
    isAdmin: true
  },
  {
    _id: "u_admin_legacy",
    name: "Admin",
    email: "admin@velor.shop",
    password: bcrypt.hashSync("admin12345", 10),
    isAdmin: true
  }
];

const orders = [];
const supportTickets = [];
const reviews = [];

module.exports = { products, users, orders, supportTickets, reviews };


