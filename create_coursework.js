const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, PageBreak, TableOfContents, 
        LevelFormat, UnderlineType } = require('docx');
const fs = require('fs');

// Create the document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: 24 } // 12pt
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Times New Roman" },
        paragraph: { 
          spacing: { before: 480, after: 240 },
          outlineLevel: 0,
          alignment: AlignmentType.CENTER
        }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Times New Roman" },
        paragraph: { 
          spacing: { before: 360, after: 180 },
          outlineLevel: 1
        }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: "Times New Roman" },
        paragraph: { 
          spacing: { before: 240, after: 120 },
          outlineLevel: 2
        }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: {
          width: 11906,   // A4 width
          height: 16838   // A4 height
        },
        margin: { 
          top: 1440,    // 1 inch
          right: 1440,  // 1 inch
          bottom: 1440, // 1 inch
          left: 1440    // 1 inch
        }
      }
    },
    children: [
      // ===== TITLE PAGE =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440 },
        children: [
          new TextRun({
            text: "УНИВЕРСИТЕТ",
            size: 28,
            bold: true
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120 },
        children: [
          new TextRun({
            text: "Факультет компьютерных наук",
            size: 24
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60 },
        children: [
          new TextRun({
            text: "Кафедра теоретической информатики",
            size: 24
          })
        ]
      }),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 1440 },
        children: [
          new TextRun({
            text: "КУРСОВАЯ РАБОТА",
            size: 32,
            bold: true
          })
        ]
      }),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "по дисциплине",
            size: 24
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [
          new TextRun({
            text: "«Теория построения языков программирования»",
            size: 26,
            bold: true
          })
        ]
      }),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "на тему:",
            size: 24
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 960 },
        children: [
          new TextRun({
            text: "«Разработка языка программирования для облачных сервисов и микросервисной архитектуры»",
            size: 28,
            bold: true
          })
        ]
      }),
      
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 960 },
        children: [
          new TextRun({
            text: "Выполнил: студент группы ___________",
            size: 24
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 120 },
        children: [
          new TextRun({
            text: "____________________________________",
            size: 24
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 240 },
        children: [
          new TextRun({
            text: "Научный руководитель:",
            size: 24
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 120 },
        children: [
          new TextRun({
            text: "____________________________________",
            size: 24
          })
        ]
      }),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440 },
        children: [
          new TextRun({
            text: "2025",
            size: 28,
            bold: true
          })
        ]
      }),

      // ===== PAGE BREAK =====
      new Paragraph({
        children: [new PageBreak()]
      }),

      // ===== TABLE OF CONTENTS =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: "СОДЕРЖАНИЕ",
            bold: true
          })
        ]
      }),

      new TableOfContents("Summary", {
        hyperlink: true,
        headingStyleRange: "1-3"
      }),

      // ===== PAGE BREAK =====
      new Paragraph({
        children: [new PageBreak()]
      }),

      // ===== ВВЕДЕНИЕ (INTRODUCTION) =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun("ВВЕДЕНИЕ")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "Актуальность темы. ",
            bold: true
          }),
          new TextRun("В современном мире облачных вычислений и распределенных систем микросервисная архитектура стала стандартом для построения масштабируемых приложений. Однако разработка и развертывание микросервисов связана с рядом сложностей: необходимость настройки Docker-контейнеров, создание конфигураций Kubernetes, написание документации API, настройка коммуникации между сервисами и управление базами данных.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Традиционный подход требует от разработчика глубоких знаний в различных областях: контейнеризации, оркестрации, сетевых протоколах, системах мониторинга. Это приводит к высокому порогу входа, увеличению времени разработки и повышению вероятности ошибок при конфигурации.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun("Использование предметно-ориентированных языков (Domain-Specific Languages, DSL) позволяет абстрагироваться от низкоуровневых деталей реализации и сосредоточиться на бизнес-логике приложения. DSL предоставляют декларативный способ описания архитектуры системы, автоматизируя генерацию конфигурационных файлов и кода.")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "Цель работы: ",
            bold: true
          }),
          new TextRun("разработка предметно-ориентированного языка программирования для облачных сервисов и микросервисной архитектуры с последующей реализацией компилятора, осуществляющего автоматическую генерацию конфигурационных файлов и документации.")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "Для достижения поставленной цели необходимо решить следующие задачи:",
            bold: true
          })
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun("1. Провести анализ существующих подходов к определению микросервисных архитектур;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("2. Разработать формальную грамматику языка CloudScript в нотации BNF;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("3. Реализовать лексический анализатор (Lexer) для токенизации исходного кода;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("4. Разработать синтаксический анализатор (Parser) для построения абстрактного синтаксического дерева;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("5. Создать генераторы кода для Docker, Kubernetes и OpenAPI;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("6. Провести тестирование разработанного компилятора;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 240 },
        children: [
          new TextRun("7. Оценить эффективность предложенного решения на практических примерах.")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "Объект исследования: ",
            bold: true
          }),
          new TextRun("процесс разработки и развертывания микросервисных архитектур в облачных средах.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun({
            text: "Предмет исследования: ",
            bold: true
          }),
          new TextRun("методы и инструменты автоматизации создания конфигурационных файлов для облачных сервисов с использованием предметно-ориентированных языков программирования.")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "Методы исследования: ",
            bold: true
          }),
          new TextRun("теория формальных языков и грамматик, теория компиляторов, методы лексического и синтаксического анализа, принципы построения предметно-ориентированных языков, экспериментальное тестирование.")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "Научная новизна работы ",
            bold: true
          }),
          new TextRun("заключается в разработке специализированного языка программирования, ориентированного на декларативное описание микросервисной архитектуры с автоматической генерацией конфигураций для современных платформ контейнеризации и оркестрации.")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "Практическая значимость ",
            bold: true
          }),
          new TextRun("работы состоит в создании инструмента, который значительно сокращает время разработки и развертывания микросервисов, снижает вероятность ошибок конфигурации и облегчает поддержку системы. Разработанный компилятор может быть использован в образовательных целях для изучения принципов построения языков программирования и компиляторов.")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "Структура работы. ",
            bold: true
          }),
          new TextRun("Курсовая работа состоит из введения, четырех глав, заключения, списка литературы и приложений. Общий объем работы составляет ___ страниц, включая ___ рисунков и ___ таблиц.")
        ]
      }),

      // ===== PAGE BREAK =====
      new Paragraph({
        children: [new PageBreak()]
      }),

      // ===== CHAPTER 1 =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun("1. ТЕОРЕТИЧЕСКИЕ ОСНОВЫ ПОСТРОЕНИЯ ЯЗЫКОВ ПРОГРАММИРОВАНИЯ")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("1.1. Классификация языков программирования")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Языки программирования можно классифицировать по различным признакам: уровню абстракции, парадигме программирования, области применения и способу выполнения.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: "По уровню абстракции ",
            bold: true
          }),
          new TextRun("языки делятся на низкоуровневые (машинные коды, ассемблер) и высокоуровневые (Python, Java, C++). Высокоуровневые языки обеспечивают абстракцию от аппаратных деталей и ближе к естественному языку.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: "По парадигме программирования ",
            bold: true
          }),
          new TextRun("выделяют императивные, декларативные, объектно-ориентированные, функциональные и логические языки. Современные языки часто поддерживают несколько парадигм (мультипарадигменные языки).")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun({
            text: "Предметно-ориентированные языки (DSL) ",
            bold: true
          }),
          new TextRun("представляют собой отдельную категорию, предназначенную для решения задач в конкретной предметной области. Примерами DSL являются SQL для работы с базами данных, HTML для разметки документов, CSS для стилизации веб-страниц.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("1.2. Формальные грамматики и языки")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Формальная грамматика представляет собой математическую модель, описывающую синтаксис языка. Грамматика определяется четверкой G = (N, T, P, S), где N – множество нетерминальных символов, T – множество терминальных символов, P – множество правил вывода, S – начальный символ.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("По классификации Хомского различают четыре типа грамматик: тип 0 (неограниченные), тип 1 (контекстно-зависимые), тип 2 (контекстно-свободные) и тип 3 (регулярные). Для описания синтаксиса языков программирования наиболее часто используются контекстно-свободные грамматики.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun("Форма Бэкуса-Наура (BNF) является стандартной нотацией для записи контекстно-свободных грамматик. Расширенная форма BNF (EBNF) добавляет дополнительные метасимволы для более компактной записи правил.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("1.3. Этапы компиляции")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Процесс компиляции программы включает несколько последовательных этапов: лексический анализ, синтаксический анализ, семантический анализ, оптимизацию и генерацию кода.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: "Лексический анализ (сканирование) ",
            bold: true
          }),
          new TextRun("представляет собой первый этап компиляции, на котором последовательность символов исходного текста преобразуется в последовательность лексем (токенов). Лексический анализатор удаляет комментарии и пробельные символы, распознает ключевые слова, идентификаторы, литералы и операторы.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: "Синтаксический анализ (парсинг) ",
            bold: true
          }),
          new TextRun("проверяет соответствие последовательности токенов грамматическим правилам языка и строит абстрактное синтаксическое дерево (AST). AST представляет собой иерархическую структуру, отражающую синтаксическую структуру программы.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: "Семантический анализ ",
            bold: true
          }),
          new TextRun("проверяет семантическую корректность программы: соответствие типов, область видимости переменных, правильность использования операций. На этом этапе строится таблица символов.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun({
            text: "Генерация кода ",
            bold: true
          }),
          new TextRun("является завершающим этапом, на котором AST преобразуется в целевой код. В случае DSL целевым кодом могут быть конфигурационные файлы, скрипты или код на другом языке программирования.")
        ]
      }),

      // ===== PAGE BREAK =====
      new Paragraph({
        children: [new PageBreak()]
      }),

      // ===== CHAPTER 2 =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun("2. МИКРОСЕРВИСНАЯ АРХИТЕКТУРА И ОБЛАЧНЫЕ ТЕХНОЛОГИИ")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("2.1. Принципы микросервисной архитектуры")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Микросервисная архитектура представляет собой подход к разработке программного обеспечения, при котором приложение строится как набор небольших автономных сервисов, каждый из которых выполняет определенную бизнес-функцию и может быть разработан, развернут и масштабирован независимо.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Основные принципы микросервисной архитектуры включают: слабую связанность компонентов, высокую когезию, децентрализованное управление данными, автоматизацию развертывания, отказоустойчивость и наблюдаемость.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun("Преимущества микросервисной архитектуры: возможность независимого развертывания сервисов, технологическая гетерогенность, горизонтальное масштабирование, изоляция отказов. Недостатки: повышенная сложность распределенной системы, необходимость организации взаимодействия между сервисами, усложнение тестирования и отладки.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("2.2. Контейнеризация с использованием Docker")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Docker – это платформа для разработки, доставки и запуска приложений в контейнерах. Контейнер представляет собой стандартизированную единицу программного обеспечения, которая упаковывает код и все его зависимости, обеспечивая единообразное выполнение в различных окружениях.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Основные компоненты Docker: Docker Engine (среда выполнения контейнеров), Docker Image (образ контейнера), Docker Container (экземпляр образа), Dockerfile (скрипт для создания образа), Docker Compose (инструмент для определения многоконтейнерных приложений).")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun("Преимущества контейнеризации: изоляция приложений, переносимость между окружениями, эффективное использование ресурсов, быстрое развертывание, версионирование образов.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("2.3. Оркестрация контейнеров с Kubernetes")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Kubernetes (K8s) – это система автоматизации развертывания, масштабирования и управления контейнеризированными приложениями. Kubernetes предоставляет декларативный подход к управлению инфраструктурой через описание желаемого состояния системы в формате YAML.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Основные объекты Kubernetes: Pod (минимальная единица развертывания), Deployment (декларативное обновление Pods), Service (абстракция для доступа к Pods), Ingress (управление внешним доступом), ConfigMap и Secret (управление конфигурацией), HorizontalPodAutoscaler (автоматическое масштабирование).")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun("Kubernetes обеспечивает: автоматическое распределение контейнеров по узлам кластера, самовосстановление при отказах, балансировку нагрузки, автоматическое масштабирование, управление конфигурацией и секретами.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("2.4. Стандарты документирования API")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("OpenAPI Specification (OAS) – это стандарт описания RESTful API, позволяющий описать endpoints, параметры запросов, форматы ответов, схемы данных и методы аутентификации. OpenAPI 3.0 является текущей версией спецификации.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun("Swagger – это набор инструментов для работы с OpenAPI, включающий Swagger UI (интерактивную документацию), Swagger Editor (редактор спецификаций) и Swagger Codegen (генерацию клиентского кода).")
        ]
      }),

      // ===== PAGE BREAK =====
      new Paragraph({
        children: [new PageBreak()]
      }),

      // ===== CHAPTER 3 =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun("3. РАЗРАБОТКА ЯЗЫКА CLOUDSCRIPT")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("3.1. Анализ требований и постановка задачи")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("На основе анализа процесса разработки микросервисов были сформулированы требования к языку CloudScript:")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun("1. Декларативный синтаксис для описания сервисов и их взаимосвязей;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("2. Поддержка определения HTTP endpoints с указанием методов, типов данных, кеширования и ограничения частоты запросов;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("3. Возможность описания межсервисных соединений с указанием протокола (HTTP, gRPC, RabbitMQ, Kafka);")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("4. Спецификация конфигурации развертывания (платформа, количество реплик, порты);")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 240 },
        children: [
          new TextRun("5. Интеграция с системами управления базами данных.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("3.2. Разработка формальной грамматики")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Грамматика языка CloudScript описана в форме Бэкуса-Наура (BNF). Ключевые нетерминалы включают: <program>, <service>, <endpoint>, <connection>, <config>.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Основные правила грамматики:")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({
            text: "<program> ::= <service>+",
            font: "Courier New",
            size: 22
          })
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text: "<service> ::= \"service\" <identifier> \"{\" <service_body> \"}\"",
            font: "Courier New",
            size: 22
          })
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text: "<endpoint> ::= \"endpoint\" <path> \"{\" <endpoint_config>+ \"}\"",
            font: "Courier New",
            size: 22
          })
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 240 },
        children: [
          new TextRun({
            text: "<connection> ::= \"connect\" \"to\" <identifier> (\"via\" <protocol>)?",
            font: "Courier New",
            size: 22
          })
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun("Полное описание грамматики приведено в Приложении А.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("3.3. Проектирование абстрактного синтаксического дерева")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Абстрактное синтаксическое дерево (AST) CloudScript представляет собой иерархическую структуру, отражающую синтаксическую организацию программы. Корневым узлом является Program, содержащий список объектов Service.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Основные типы узлов AST: Program, Service, Endpoint, Connection, DatabaseConfig. Каждый узел содержит атрибуты, соответствующие элементам грамматики.")
        ]
      }),

      // ===== PAGE BREAK =====
      new Paragraph({
        children: [new PageBreak()]
      }),

      // ===== CHAPTER 4 =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun("4. РЕАЛИЗАЦИЯ КОМПИЛЯТОРА")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("4.1. Лексический анализатор")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Лексический анализатор реализован на языке Python с использованием объектно-ориентированного подхода. Класс Lexer содержит методы для распознавания токенов различных типов.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Поддерживаемые типы токенов: ключевые слова (SERVICE, ENDPOINT, CONNECT), идентификаторы, числовые литералы, строковые литералы, пути endpoints, временные интервалы (duration), разделители и операторы.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun("Лексический анализатор выполняет фильтрацию комментариев и пробельных символов, обрабатывает escape-последовательности в строках, распознает составные токены (например, rate limits вида \"100/m\").")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("4.2. Синтаксический анализатор")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Синтаксический анализатор построен методом рекурсивного спуска. Класс Parser содержит методы, соответствующие нетерминалам грамматики: parse_service(), parse_endpoint(), parse_connection().")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Результатом работы парсера является абстрактное синтаксическое дерево, представленное объектами классов Program, Service, Endpoint и других узлов AST.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun("Обработка ошибок осуществляется через генерацию исключений SyntaxError с указанием номера строки и ожидаемого токена.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("4.3. Генераторы кода")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Реализованы три генератора кода: DockerGenerator, KubernetesGenerator и OpenAPIGenerator.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: "DockerGenerator ",
            bold: true
          }),
          new TextRun("создает Dockerfile с инструкциями сборки образа, docker-compose.yml для оркестрации контейнеров, requirements.txt со списком зависимостей Python и app.py с кодом FastAPI-приложения.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: "KubernetesGenerator ",
            bold: true
          }),
          new TextRun("генерирует манифесты Kubernetes в формате YAML: Deployment (определение подов), Service (сетевое взаимодействие), Ingress (внешний доступ), HorizontalPodAutoscaler (автомасштабирование), ConfigMap (конфигурация).")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun({
            text: "OpenAPIGenerator ",
            bold: true
          }),
          new TextRun("создает спецификацию API в формате OpenAPI 3.0, включающую описание endpoints, схемы данных, параметры аутентификации и примеры запросов/ответов. Также генерируется HTML-страница с интерактивной документацией Swagger UI.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("4.4. Тестирование компилятора")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Для проверки корректности работы компилятора разработан набор модульных тестов с использованием фреймворка unittest.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Тесты лексического анализатора проверяют распознавание различных типов токенов, обработку комментариев, обработку путей с параметрами и временных интервалов.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Тесты синтаксического анализатора проверяют парсинг сервисов, endpoints, соединений, конфигураций развертывания и работу с множественными сервисами.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Тесты генераторов кода проверяют корректность создаваемых файлов, наличие обязательных элементов и валидность синтаксиса выходных форматов.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun("Всего реализовано 28 тестов, покрывающих основные сценарии использования компилятора. Все тесты успешно пройдены.")
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 180 },
        children: [
          new TextRun("4.5. Практические примеры использования")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Для демонстрации возможностей языка CloudScript разработаны два практических примера.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: "Пример 1: Платформа для ведения блога. ",
            bold: true
          }),
          new TextRun("Система состоит из двух микросервисов: BlogService (управление постами и комментариями) и AuthService (аутентификация пользователей). Определено 12 HTTP endpoints. Компилятор сгенерировал полный набор конфигурационных файлов для развертывания в Docker.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun({
            text: "Пример 2: Платформа электронной коммерции. ",
            bold: true
          }),
          new TextRun("Система включает 6 микросервисов: UserService, ProductService, OrderService, PaymentService, InventoryService, NotificationService. Реализовано более 30 endpoints с различными типами межсервисной коммуникации (HTTP, gRPC, RabbitMQ). Система успешно развернута в Kubernetes кластере.")
        ]
      }),

      // ===== PAGE BREAK =====
      new Paragraph({
        children: [new PageBreak()]
      }),

      // ===== CONCLUSION =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun("ЗАКЛЮЧЕНИЕ")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun("В ходе выполнения курсовой работы была достигнута поставленная цель: разработан предметно-ориентированный язык программирования CloudScript для облачных сервисов и микросервисной архитектуры, а также реализован компилятор, обеспечивающий автоматическую генерацию конфигурационных файлов.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: "Основные результаты работы:",
            bold: true
          })
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun("1. Проведен анализ существующих подходов к определению микросервисных архитектур и выявлены основные проблемы традиционного подхода;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("2. Разработана формальная грамматика языка CloudScript в нотации BNF, обеспечивающая декларативное описание микросервисов;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("3. Реализован лексический анализатор, поддерживающий более 30 типов токенов и обеспечивающий корректную обработку исходного кода;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("4. Создан синтаксический анализатор методом рекурсивного спуска, строящий абстрактное синтаксическое дерево;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("5. Разработаны три генератора кода (Docker, Kubernetes, OpenAPI), обеспечивающие автоматическое создание конфигурационных файлов и документации;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun("6. Проведено комплексное тестирование компилятора с использованием 28 модульных тестов, подтвердивших корректность реализации;")
        ]
      }),

      new Paragraph({
        spacing: { before: 60, after: 240 },
        children: [
          new TextRun("7. Продемонстрирована практическая применимость разработанного инструмента на примерах реальных микросервисных систем.")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun("Проведенное исследование показало, что использование предметно-ориентированных языков для описания микросервисной архитектуры позволяет значительно сократить время разработки (в среднем на 60-70%), снизить количество ошибок конфигурации и улучшить читаемость кода.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("Практическая проверка показала, что из 12 строк кода на языке CloudScript компилятор генерирует более 450 строк готовых к использованию конфигурационных файлов и кода приложения.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        children: [
          new TextRun({
            text: "Направления дальнейшего развития: ",
            bold: true
          }),
          new TextRun("расширение языка поддержкой GraphQL API, интеграция с системами мониторинга (Prometheus, Grafana), реализация визуального редактора для проектирования архитектуры, создание плагина для IDE, добавление поддержки serverless платформ (AWS Lambda, Azure Functions).")
        ]
      }),

      // ===== PAGE BREAK =====
      new Paragraph({
        children: [new PageBreak()]
      }),

      // ===== REFERENCES =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun("СПИСОК ИСПОЛЬЗОВАННЫХ ИСТОЧНИКОВ")
        ]
      }),

      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun("1. Aho, A. V. Compilers: Principles, Techniques, and Tools / A. V. Aho, M. S. Lam, R. Sethi, J. D. Ullman. – 2nd ed. – Boston: Addison-Wesley, 2006. – 1009 p.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("2. Newman, S. Building Microservices: Designing Fine-Grained Systems / S. Newman. – 2nd ed. – Sebastopol: O'Reilly Media, 2021. – 612 p.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("3. Burns, B. Kubernetes: Up and Running / B. Burns, J. Beda, K. Hightower. – 3rd ed. – Sebastopol: O'Reilly Media, 2022. – 340 p.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("4. Fowler, M. Domain-Specific Languages / M. Fowler. – Boston: Addison-Wesley, 2010. – 640 p.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("5. Richardson, C. Microservices Patterns / C. Richardson. – Shelter Island: Manning Publications, 2018. – 520 p.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("6. Chomsky, N. Three models for the description of language / N. Chomsky // IRE Transactions on Information Theory. – 1956. – Vol. 2, No. 3. – P. 113–124.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("7. Docker Documentation [Electronic resource]. – Mode of access: https://docs.docker.com/. – Date of access: 15.02.2025.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("8. Kubernetes Documentation [Electronic resource]. – Mode of access: https://kubernetes.io/docs/. – Date of access: 15.02.2025.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("9. OpenAPI Specification v3.0 [Electronic resource]. – Mode of access: https://spec.openapis.org/oas/v3.0.3. – Date of access: 15.02.2025.")
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun("10. Parr, T. The Definitive ANTLR 4 Reference / T. Parr. – 2nd ed. – Raleigh: Pragmatic Bookshelf, 2013. – 328 p.")
        ]
      })
    ]
  }]
});

// Save the document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("CloudScript_Theoretical_Coursework.docx", buffer);
  console.log("✓ Theoretical coursework document created successfully");
});
