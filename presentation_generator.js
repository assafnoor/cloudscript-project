// CloudScript Presentation Generator
const pptxgen = require("pptxgenjs");

// Create presentation
const pres = new pptxgen();

// Color scheme: Teal Trust (professional cloud theme)
const COLORS = {
  primary: "028090",    // Teal
  secondary: "00A896",  // Seafoam
  accent: "02C39A",     // Mint
  dark: "065A82",       // Deep blue
  white: "FFFFFF",
  lightBg: "F5F9FC",
  text: "2C3E50"
};

// Fonts
const FONTS = {
  title: { face: "Arial Black", size: 36, bold: true },
  subtitle: { face: "Arial", size: 20 },
  header: { face: "Arial Black", size: 28, bold: true },
  body: { face: "Arial", size: 14 },
  caption: { face: "Arial", size: 10, color: "7F8C8D" }
};

// ===== SLIDE 1: Title =====
let slide = pres.addSlide();
slide.background = { color: COLORS.dark };

// Main title with cloud icon
slide.addText("CloudScript", {
  x: 0.5, y: 2.0, w: 9.0, h: 1.5,
  fontSize: 54,
  bold: true,
  color: COLORS.white,
  align: "center",
  fontFace: "Arial Black"
});

slide.addText("Domain-Specific Language for Cloud Microservices", {
  x: 0.5, y: 3.5, w: 9.0, h: 0.6,
  fontSize: 20,
  color: COLORS.secondary,
  align: "center",
  fontFace: "Arial"
});

slide.addText([
  { text: "Theory of Programming Languages\n", options: { fontSize: 14, color: COLORS.white } },
  { text: "Course Project 2025", options: { fontSize: 14, color: COLORS.secondary } }
], {
  x: 0.5, y: 5.0, w: 9.0, h: 0.8,
  align: "center"
});

// ===== SLIDE 2: Problem Statement =====
slide = pres.addSlide();
slide.addText("The Problem", {
  x: 0.5, y: 0.5, w: 9.0, h: 0.7,
  ...FONTS.header,
  color: COLORS.dark
});

const problems = [
  { icon: "❌", title: "Complex Configuration", desc: "Docker, K8s, OpenAPI - too many files to manage" },
  { icon: "⚠️", title: "Repetitive Boilerplate", desc: "Same patterns repeated across services" },
  { icon: "🔧", title: "Maintenance Burden", desc: "Updates require changes in multiple places" },
  { icon: "📚", title: "Steep Learning Curve", desc: "Developers need expertise in many technologies" }
];

problems.forEach((p, i) => {
  const y = 1.5 + (i * 1.2);
  
  // Icon circle
  slide.addShape(pres.shapes.OVAL, {
    x: 0.7, y: y, w: 0.5, h: 0.5,
    fill: { color: COLORS.primary }
  });
  
  slide.addText(p.icon, {
    x: 0.7, y: y, w: 0.5, h: 0.5,
    fontSize: 20,
    align: "center",
    valign: "middle"
  });
  
  slide.addText(p.title, {
    x: 1.4, y: y, w: 7.6, h: 0.3,
    fontSize: 16,
    bold: true,
    color: COLORS.text
  });
  
  slide.addText(p.desc, {
    x: 1.4, y: y + 0.35, w: 7.6, h: 0.3,
    fontSize: 12,
    color: "7F8C8D"
  });
});

// ===== SLIDE 3: Solution =====
slide = pres.addSlide();
slide.addText("Our Solution: CloudScript", {
  x: 0.5, y: 0.5, w: 9.0, h: 0.7,
  ...FONTS.header,
  color: COLORS.dark
});

slide.addText([
  { text: "One Language. ", options: { bold: true, color: COLORS.primary } },
  { text: "Multiple Outputs.\n\n", options: { color: COLORS.text } },
  { text: "CloudScript is a DSL that lets you define microservices in a simple, declarative syntax. ", options: { color: COLORS.text } },
  { text: "Our compiler automatically generates all deployment configurations, API docs, and containerization files.", options: { color: COLORS.text } }
], {
  x: 0.5, y: 1.4, w: 9.0, h: 2.0,
  fontSize: 16,
  align: "center",
  valign: "middle"
});

// Large code example
const code = `service UserService {
    endpoint /users {
        method: GET
        response: User[]
        cache: 5m
    }
    
    deploy on: kubernetes
    port: 8080
}`;

slide.addShape(pres.shapes.RECTANGLE, {
  x: 1.5, y: 3.6, w: 7.0, h: 2.0,
  fill: { color: "1E1E1E" },
  line: { type: "solid", color: COLORS.primary, width: 2 }
});

slide.addText(code, {
  x: 1.7, y: 3.8, w: 6.6, h: 1.6,
  fontSize: 11,
  fontFace: "Courier New",
  color: "00FF00",
  valign: "middle"
});

// ===== SLIDE 4: Architecture =====
slide = pres.addSlide();
slide.addText("Compiler Architecture", {
  x: 0.5, y: 0.5, w: 9.0, h: 0.7,
  ...FONTS.header,
  color: COLORS.dark
});

const stages = [
  { title: "Lexical Analysis", desc: "Tokenization", icon: "📝" },
  { title: "Syntax Analysis", desc: "Parse & Build AST", icon: "🌳" },
  { title: "Code Generation", desc: "Docker, K8s, OpenAPI", icon: "⚙️" }
];

stages.forEach((stage, i) => {
  const x = 1.0 + (i * 2.8);
  const y = 2.0;
  
  // Box
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 2.4, h: 2.5,
    fill: { color: COLORS.lightBg },
    line: { type: "solid", color: COLORS.primary, width: 2 }
  });
  
  // Icon
  slide.addText(stage.icon, {
    x: x, y: y + 0.3, w: 2.4, h: 0.6,
    fontSize: 40,
    align: "center"
  });
  
  // Title
  slide.addText(stage.title, {
    x: x, y: y + 1.2, w: 2.4, h: 0.5,
    fontSize: 14,
    bold: true,
    color: COLORS.text,
    align: "center"
  });
  
  // Description
  slide.addText(stage.desc, {
    x: x, y: y + 1.7, w: 2.4, h: 0.6,
    fontSize: 11,
    color: "7F8C8D",
    align: "center"
  });
  
  // Arrow
  if (i < stages.length - 1) {
    slide.addShape(pres.shapes.RIGHT_ARROW, {
      x: x + 2.5, y: y + 1.0, w: 0.5, h: 0.4,
      fill: { color: COLORS.accent }
    });
  }
});

// ===== SLIDE 5: Features =====
slide = pres.addSlide();
slide.addText("Key Features", {
  x: 0.5, y: 0.5, w: 9.0, h: 0.7,
  ...FONTS.header,
  color: COLORS.dark
});

const features = [
  ["🔤 Simple Syntax", "🚀 Multi-Platform"],
  ["📚 Auto-Documentation", "✅ Type-Safe"],
  ["🔌 Protocol Support", "💾 Database Integration"]
];

features.forEach((row, rowIdx) => {
  row.forEach((feature, colIdx) => {
    const x = 1.0 + (colIdx * 4.2);
    const y = 1.7 + (rowIdx * 1.4);
    
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 3.6, h: 0.9,
      fill: { color: COLORS.primary },
      line: { type: "none" }
    });
    
    slide.addText(feature, {
      x: x, y: y, w: 3.6, h: 0.9,
      fontSize: 16,
      bold: true,
      color: COLORS.white,
      align: "center",
      valign: "middle"
    });
  });
});

// ===== SLIDE 6: Generated Outputs =====
slide = pres.addSlide();
slide.addText("What CloudScript Generates", {
  x: 0.5, y: 0.5, w: 9.0, h: 0.7,
  ...FONTS.header,
  color: COLORS.dark
});

const outputs = [
  { category: "Docker", items: ["Dockerfile", "docker-compose.yml", "requirements.txt", "app.py"] },
  { category: "Kubernetes", items: ["Deployments", "Services", "Ingress", "HPA", "ConfigMaps"] },
  { category: "Documentation", items: ["OpenAPI 3.0 spec", "Swagger UI", "Request/Response schemas"] }
];

outputs.forEach((out, i) => {
  const y = 1.5 + (i * 1.5);
  
  slide.addText(out.category, {
    x: 0.7, y: y, w: 2.0, h: 0.4,
    fontSize: 16,
    bold: true,
    color: COLORS.primary
  });
  
  slide.addText("• " + out.items.join("  • "), {
    x: 3.0, y: y, w: 6.5, h: 0.4,
    fontSize: 13,
    color: COLORS.text
  });
});

// ===== SLIDE 7: Example Use Case =====
slide = pres.addSlide();
slide.addText("Example: E-commerce Platform", {
  x: 0.5, y: 0.5, w: 9.0, h: 0.7,
  ...FONTS.header,
  color: COLORS.dark
});

const services = [
  { name: "UserService", port: "8001" },
  { name: "ProductService", port: "8002" },
  { name: "OrderService", port: "8003" },
  { name: "PaymentService", port: "8004" },
  { name: "InventoryService", port: "8005" },
  { name: "NotificationService", port: "8006" }
];

services.forEach((svc, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 1.0 + (col * 2.8);
  const y = 1.7 + (row * 1.6);
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 2.4, h: 1.0,
    fill: { color: COLORS.secondary },
    line: { type: "solid", color: COLORS.primary, width: 1 }
  });
  
  slide.addText(svc.name, {
    x: x, y: y + 0.2, w: 2.4, h: 0.4,
    fontSize: 13,
    bold: true,
    color: COLORS.white,
    align: "center"
  });
  
  slide.addText("Port: " + svc.port, {
    x: x, y: y + 0.6, w: 2.4, h: 0.3,
    fontSize: 10,
    color: COLORS.white,
    align: "center"
  });
});

slide.addText("6 Services • 30+ Endpoints • Full Deployment Config", {
  x: 0.5, y: 5.2, w: 9.0, h: 0.4,
  fontSize: 14,
  italic: true,
  color: COLORS.primary,
  align: "center"
});

// ===== SLIDE 8: Testing & Quality =====
slide = pres.addSlide();
slide.addText("Testing & Quality Assurance", {
  x: 0.5, y: 0.5, w: 9.0, h: 0.7,
  ...FONTS.header,
  color: COLORS.dark
});

const tests = [
  { name: "Lexer Tests", count: "8 tests", status: "✓" },
  { name: "Parser Tests", count: "10 tests", status: "✓" },
  { name: "Generator Tests", count: "6 tests", status: "✓" },
  { name: "End-to-End Tests", count: "4 tests", status: "✓" }
];

tests.forEach((test, i) => {
  const y = 1.8 + (i * 1.0);
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1.5, y: y, w: 7.0, h: 0.7,
    fill: { color: COLORS.lightBg },
    line: { type: "solid", color: COLORS.secondary, width: 1 }
  });
  
  slide.addText(test.status, {
    x: 1.7, y: y + 0.1, w: 0.5, h: 0.5,
    fontSize: 24,
    color: "27AE60",
    bold: true,
    align: "center",
    valign: "middle"
  });
  
  slide.addText(test.name, {
    x: 2.5, y: y + 0.15, w: 3.0, h: 0.4,
    fontSize: 15,
    bold: true,
    color: COLORS.text
  });
  
  slide.addText(test.count, {
    x: 5.8, y: y + 0.15, w: 2.0, h: 0.4,
    fontSize: 13,
    color: "7F8C8D",
    align: "right"
  });
});

// ===== SLIDE 9: Results =====
slide = pres.addSlide();
slide.addText("Project Results", {
  x: 0.5, y: 0.5, w: 9.0, h: 0.7,
  ...FONTS.header,
  color: COLORS.dark
});

const stats = [
  { value: "2000+", label: "Lines of Code", color: COLORS.primary },
  { value: "28", label: "Test Cases", color: COLORS.secondary },
  { value: "3", label: "Code Generators", color: COLORS.accent }
];

stats.forEach((stat, i) => {
  const x = 1.0 + (i * 2.8);
  const y = 2.2;
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 2.4, h: 2.0,
    fill: { color: stat.color },
    line: { type: "none" }
  });
  
  slide.addText(stat.value, {
    x: x, y: y + 0.5, w: 2.4, h: 0.8,
    fontSize: 48,
    bold: true,
    color: COLORS.white,
    align: "center"
  });
  
  slide.addText(stat.label, {
    x: x, y: y + 1.3, w: 2.4, h: 0.4,
    fontSize: 14,
    color: COLORS.white,
    align: "center"
  });
});

// ===== SLIDE 10: Conclusion =====
slide = pres.addSlide();
slide.background = { color: COLORS.dark };

slide.addText("Conclusion", {
  x: 0.5, y: 1.5, w: 9.0, h: 0.8,
  fontSize: 36,
  bold: true,
  color: COLORS.white,
  align: "center"
});

slide.addText([
  { text: "CloudScript simplifies microservice development\n", options: { fontSize: 18, color: COLORS.white } },
  { text: "by providing a declarative DSL that generates\n", options: { fontSize: 18, color: COLORS.white } },
  { text: "production-ready deployment configurations.", options: { fontSize: 18, color: COLORS.white } }
], {
  x: 0.5, y: 2.8, w: 9.0, h: 1.5,
  align: "center"
});

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 2.5, y: 4.5, w: 5.0, h: 0.8,
  fill: { color: COLORS.primary },
  line: { type: "none" }
});

slide.addText("Thank You!", {
  x: 2.5, y: 4.5, w: 5.0, h: 0.8,
  fontSize: 24,
  bold: true,
  color: COLORS.white,
  align: "center",
  valign: "middle"
});

// Save presentation
pres.writeFile({ fileName: "CloudScript_Presentation.pptx" });
console.log("✓ Presentation created: CloudScript_Presentation.pptx");
