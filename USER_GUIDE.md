# CloudScript Project - Complete Guide
## دليل المشروع الشامل

---

## 📚 نظرة عامة

هذا المشروع هو **لغة برمجة خاصة (DSL)** لتعريف وإنشاء خدمات سحابية صغيرة (Microservices). تم تطويره كمشروع تخرج لمادة "نظرية بناء لغات البرمجة".

### ✨ ما يميز المشروع:

1. **لغة برمجة كاملة** مع Lexer و Parser و Code Generators
2. **توليد تلقائي** لملفات Docker, Kubernetes, و OpenAPI
3. **أمثلة عملية** كاملة قابلة للتشغيل
4. **اختبارات شاملة** (28 test case)
5. **توثيق احترافي** كامل

---

## 📂 هيكل المشروع

```
cloudscript-project/
├── src/                          # الكود المصدري
│   ├── lexer.py                 # المحلل اللفظي (Lexical Analyzer)
│   ├── parser.py                # المحلل النحوي (Parser)
│   ├── ast_nodes.py             # تعريفات شجرة البناء النحوي (AST)
│   ├── docker_generator.py      # مولد ملفات Docker
│   ├── kubernetes_generator.py  # مولد ملفات Kubernetes
│   ├── openapi_generator.py     # مولد وثائق API
│   └── cloudscript.py           # البرنامج الرئيسي
│
├── examples/                     # أمثلة عملية
│   ├── blog.cs                  # مثال: منصة مدونة
│   └── ecommerce.cs             # مثال: منصة تجارة إلكترونية
│
├── tests/                        # الاختبارات
│   └── test_all.py              # جميع الاختبارات
│
├── docs/                         # الوثائق
│   └── GRAMMAR.md               # قواعد اللغة (Grammar)
│
├── generated/                    # الملفات المُنتَجة
│
├── README.md                     # دليل المستخدم
├── requirements.txt              # المكتبات المطلوبة
└── CloudScript_Presentation.pptx # العرض التقديمي
```

---

## 🚀 كيفية الاستخدام

### 1. التثبيت

```bash
# تثبيت المكتبات المطلوبة
pip install -r requirements.txt
```

### 2. كتابة كود CloudScript

أنشئ ملف `myservice.cs`:

```cloudscript
service UserService {
    endpoint /users {
        method: GET
        response: User[]
        cache: 5m
        rateLimit: 100/m
    }
    
    deploy on: docker
    port: 8080
    replicas: 3
}
```

### 3. تشغيل الكمبايلر

```bash
# توليد جميع الملفات
python src/cloudscript.py compile myservice.cs

# توليد Docker فقط
python src/cloudscript.py compile myservice.cs --target docker

# توليد Kubernetes فقط
python src/cloudscript.py compile myservice.cs --target k8s

# مع تفاصيل إضافية
python src/cloudscript.py compile myservice.cs -v
```

### 4. تشغيل الخدمة

```bash
cd generated
docker-compose up
```

---

## 📖 قواعد اللغة (Syntax)

### تعريف خدمة (Service)

```cloudscript
service ServiceName {
    // محتوى الخدمة
}
```

### تعريف نقطة نهاية (Endpoint)

```cloudscript
endpoint /path {
    method: GET | POST | PUT | DELETE | PATCH
    response: TypeName | TypeName[]
    cache: 5m       // اختياري
    rateLimit: 100/m  // اختياري
    timeout: 3s     // اختياري
    auth: required  // اختياري
}
```

### الاتصال بخدمات أخرى

```cloudscript
connect to ServiceName via http | grpc | rabbitmq | kafka
```

### إعدادات النشر

```cloudscript
deploy on: docker | kubernetes | aws | azure | gcp
port: 8080
replicas: 3
```

### قاعدة البيانات

```cloudscript
database postgres {
    host: "localhost"
    port: 5432
}
```

---

## 🧪 تشغيل الاختبارات

```bash
cd tests
python test_all.py
```

### نتائج الاختبارات:
- ✅ Lexer Tests: 8/8 passed
- ✅ Parser Tests: 10/10 passed
- ✅ Generator Tests: 6/6 passed
- ✅ End-to-End Tests: 4/4 passed

**إجمالي: 28/28 اختبار ناجح**

---

## 📝 الأمثلة

### مثال 1: منصة مدونة بسيطة

```bash
python src/cloudscript.py compile examples/blog.cs
```

**النتيجة:**
- 2 خدمات (BlogService, AuthService)
- 12 نقطة نهاية (Endpoints)
- ملفات Docker كاملة
- ملفات Kubernetes
- وثائق OpenAPI

### مثال 2: منصة تجارة إلكترونية

```bash
python src/cloudscript.py compile examples/ecommerce.cs
```

**النتيجة:**
- 6 خدمات مترابطة
- 30+ نقطة نهاية
- معمارية Microservices كاملة

---

## 🎯 ما يولده الكمبايلر

### 1. ملفات Docker
- `Dockerfile` - تعليمات البناء
- `docker-compose.yml` - تنسيق الخدمات
- `requirements.txt` - المكتبات المطلوبة
- `app.py` - كود FastAPI جاهز

### 2. ملفات Kubernetes
- `Deployment` - تعريف Pods
- `Service` - الشبكة الداخلية
- `Ingress` - الوصول الخارجي
- `HorizontalPodAutoscaler` - التوسع التلقائي
- `ConfigMap` - الإعدادات

### 3. وثائق API
- `openapi.json` - مواصفات OpenAPI 3.0
- `swagger.html` - واجهة Swagger UI تفاعلية
- Schemas كاملة للطلبات والاستجابات

---

## 🏗️ معمارية الكمبايلر

```
ملف المصدر (.cs)
    ↓
Lexical Analysis → Tokens
    ↓
Syntax Analysis → Abstract Syntax Tree (AST)
    ↓
Code Generation
    ├── Docker Generator
    ├── Kubernetes Generator
    └── OpenAPI Generator
    ↓
الملفات المُنتَجة
```

---

## 💡 المفاهيم المُطبقة

### 1. نظرية اللغات
- ✅ تصميم Grammar (BNF)
- ✅ Lexical Analysis (Tokenization)
- ✅ Syntax Analysis (Parsing)
- ✅ Abstract Syntax Tree (AST)
- ✅ Code Generation

### 2. تقنيات سحابية
- ✅ Containerization (Docker)
- ✅ Orchestration (Kubernetes)
- ✅ Microservices Architecture
- ✅ API Documentation (OpenAPI)

### 3. هندسة البرمجيات
- ✅ Domain-Specific Languages
- ✅ Compiler Design Patterns
- ✅ Test-Driven Development
- ✅ Clean Code Principles

---

## 📊 إحصائيات المشروع

| المقياس | القيمة |
|---------|--------|
| عدد أسطر الكود | 2000+ |
| عدد الملفات | 15 |
| عدد الاختبارات | 28 |
| عدد الأمثلة | 2 (كاملة) |
| Code Generators | 3 |
| Output Formats | 10+ |

---

## 🎓 الأهداف التعليمية

### ما تعلمناه:
1. **تصميم اللغات** - كيفية إنشاء لغة برمجة من الصفر
2. **Compiler Construction** - بناء كمبايلر كامل
3. **Cloud Technologies** - Docker, Kubernetes, APIs
4. **Software Engineering** - Testing, Documentation, Clean Code

---

## 🔍 نقاط القوة

1. ✅ **مشروع عملي كامل** - ليس مجرد نموذج نظري
2. ✅ **قابل للتشغيل** - يمكن تجربته فوراً
3. ✅ **موثق بالكامل** - كود واضح مع تعليقات
4. ✅ **مُختبر جيداً** - 28 اختبار شامل
5. ✅ **احترافي** - يولد ملفات جاهزة للإنتاج

---

## 📈 التطويرات المستقبلية

- [ ] دعم GraphQL
- [ ] Service Mesh Integration
- [ ] توليد CI/CD Pipelines
- [ ] Visual Studio Code Extension
- [ ] دعم AWS Lambda & Azure Functions

---

## 📞 المساعدة والدعم

إذا كان لديك أي استفسار:

1. راجع `docs/GRAMMAR.md` للتفاصيل التقنية
2. جرب الأمثلة في `examples/`
3. اقرأ التعليقات في الكود المصدري

---

## 🎉 الخلاصة

CloudScript هو مشروع متكامل يجمع بين:
- **النظرية**: تصميم لغات البرمجة
- **العملي**: تقنيات سحابية حديثة
- **الاحترافية**: كود نظيف ومُختبر

المشروع جاهز للتقديم ويحقق جميع متطلبات المشروع الأكاديمي! 🎓✨

---

**تم إعداد هذا المشروع لمادة: نظرية بناء لغات البرمجة**  
**جامعة: [اسم جامعتك]**  
**السنة: 2025**
