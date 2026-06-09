export interface Question {
  id: number;
  tense: 'Simple' | 'Perfecto' | 'General';
  difficulty: 'fácil' | 'medio' | 'difícil';
  questionText: string;
  questionTextArm: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationArm: string;
}

export interface RoundWord {
  word: string; // must be uppercase
  clue: string;
  clueArm: string;
  category: string;
  categoryArm: string;
}

export const ROUND_WORDS: RoundWord[] = [
  {
    word: "DISFRUTAR",
    clue: "¡La palabra principal del juego! Un gran verbo en español que significa 'sentir deleite', 'gozar', 'percibir deleite' o pasarlo muy bien.",
    clueArm: "Խաղի գլխավոր բառը՝ իսպաներեն հիանալի մի բայ, որը նշանակում է «վայելել», «հաճույք ստանալ» կամ լավ ժամանակ անցկացնել։",
    category: "Verbo (Infinitivo)",
    categoryArm: "Բայ (Անորոշ դերբայ)"
  },
  {
    word: "DISFRUTARE",
    clue: "Forma de la primera persona singular (Yo) del verbo 'disfrutar' en Futuro Simple (Yo disfrutaré mañana).",
    clueArm: "«Disfrutar» բայի եզակի թվի 1-ին դեմքի (Yo - Ես) ձևը Futuro Simple-ում (Yo disfrutaré mañana - Ես վաղը կվայելեմ)։",
    category: "Futuro Simple (Yo)",
    categoryArm: "Futuro Simple (Ես)"
  },
  {
    word: "DISFRUTAREMOS",
    clue: "Forma del verbo 'disfrutar' en Futuro Simple para la primera persona plural (Nosotros disfrutaremos juntos).",
    clueArm: "«Disfrutar» բայի հոգնակի թվի 1-ին դեմքի (Nosotros - Մենք) ձևը Futuro Simple-ում (Nosotros disfrutaremos juntos - Մենք միասին կվայելենք)։",
    category: "Futuro Simple (Nosotros)",
    categoryArm: "Futuro Simple (Մենք)"
  },
  {
    word: "HABREDISFRUTADO",
    clue: "Forma del verbo 'disfrutar' en Futuro Perfecto para la primera de singular (Para ese momento, yo ya habré disfrutado de la fiesta).",
    clueArm: "«Disfrutar» բայի եզակի թվի 1-ին դեմքի ձևը Futuro Perfecto-ում (Para ese momento, yo ya habré disfrutado - Այդ պահին ես արդեն վայելած կլինեմ)։",
    category: "Futuro Perfecto (Yo)",
    categoryArm: "Futuro Perfecto (Ես)"
  },
  {
    word: "HABRANLOGRADO",
    clue: "Forma de Futuro Perfecto del verbo 'lograr' (alcanzar) para la tercera persona plural (Antes de que acabe la ronda, ellos ya habrán logrado su meta).",
    clueArm: "«Lograr» (հասնել/նվաճել) բայի հոգնակի թվի 3-րդ դեմքի (Ellos/Ellas - Նրանք) ձևը Futuro Perfecto-ում (նախքան փուլի ավարտը նրանք արդեն հասած կլինեն իրենց նպատակին)։",
    category: "Futuro Perfecto (Ellos/Ellas)",
    categoryArm: "Futuro Perfecto (Նրանք)"
  },
  {
    word: "TENDRAS",
    clue: "Forma del famosísimo verbo irregular 'tener' en Futuro Simple para la segunda persona singular (Tú tendrás éxito).",
    clueArm: "Հանրահայտ «tener» (ունենալ) անկանոն բայի եզակի թվի 2-րդ դեմքի (Tú - Դու) ձևը Futuro Simple-ում (Tú tendrás éxito - Դու հաջողություն կունենաս)։",
    category: "Futuro Simple (Tú) - Irregular",
    categoryArm: "Futuro Simple (Դու) - Անկանոն"
  }
];

export const GRAMMAR_QUESTIONS: Question[] = [
  {
    id: 1,
    tense: 'Simple',
    difficulty: 'fácil',
    questionText: "Mañana yo ________ (hablar) con el profesor sobre mi examen de español.",
    questionTextArm: "Վաղը ես ________ (hablar) պրոֆեսորի հետ իմ իսպաներենի քննության մասին։",
    options: ["hablaré", "hablarás", "hablará", "hablaremos"],
    correctIndex: 0,
    explanation: "Para la primera persona singular (Yo) en Futuro Simple, agregamos '-é' al infinitivo directamente.",
    explanationArm: "Եզակի թվի 1-ին դեմքի (Yo - Ես) համար Futuro Simple-ում անորոշ դերբային ավելացնում ենք «-é» վերջավորությունը։"
  },
  {
    id: 2,
    tense: 'Simple',
    difficulty: 'fácil',
    questionText: "Si viajas a España, tú ________ (disfrutar) de su maravillosa gastronomía.",
    questionTextArm: "Եթե ճանապարհորդես Իսպանիա, դու ________ (disfrutar) նրա հրաշալի խոհանոցը։",
    options: ["disfrutaré", "disfrutarás", "disfrutará", "disfrutaremos"],
    correctIndex: 1,
    explanation: "La terminación para 'Tú' (segunda persona singular) en Futuro Simple siempre es '-ás'.",
    explanationArm: "Futuro Simple-ում 'Tú' (դու - եզակի թվի 2-րդ դեմք) դեմքի վերջավորությունը միշտ «-ás» է։"
  },
  {
    id: 3,
    tense: 'Simple',
    difficulty: 'fácil',
    questionText: "La próxima semana, ella ________ (escribir) un correo electrónico de agradecimiento.",
    questionTextArm: "Հաջորդ շաբաթ նա ________ (escribir) շնորհակալական նամակ։",
    options: ["escribiré", "escribirá", "escribirán", "escribiremos"],
    correctIndex: 1,
    explanation: "Para la tercera persona singular (Él/Ella/Usted) en Futuro Simple, la terminación es '-á' añadida al infinitivo.",
    explanationArm: "Եզակի թվի 3-րդ դեմքի (Él/Ella) համար Futuro Simple-ում անորոշ դերբային ավելանում է «-á» վերջավորությունը։"
  },
  {
    id: 4,
    tense: 'Simple',
    difficulty: 'fácil',
    questionText: "El próximo verano, nosotros ________ (viajar) a Barcelona juntos.",
    questionTextArm: "Հաջորդ ամառ մենք միասին ________ (viajar) Բարսելոնա։",
    options: ["viajaré", "viajarán", "viajaremos", "viajaréis"],
    correctIndex: 2,
    explanation: "Para nosotros (primera persona plural) en Futuro Simple, añadimos la terminación '-emos' al infinitivo. Es la única forma sin tilde gráfico.",
    explanationArm: "«Nosotros» (մենք) հոգնակի թվի 1-ին դեմքի համար անորոշ դերբային ավելացնում ենք «-emos»։ Սա միակ ձևն է առանց գրավոր շեշտի նշանի (tilde)։"
  },
  {
    id: 5,
    tense: 'Simple',
    difficulty: 'medio',
    questionText: "En este curso de español, vosotros ________ (aprender) mucho vocabulario útil.",
    questionTextArm: "Իսպաներենի այս դասընթացում դուք ________ (aprender) շատ օգտակար բառապաշար։",
    options: ["aprenderé", "aprenderéis", "aprenderán", "aprenderemos"],
    correctIndex: 1,
    explanation: "Para vosotros (segunda persona plural) en Futuro Simple, añadimos la terminación '-éis' al infinitivo.",
    explanationArm: "«Vosotros» (դուք) հոգնակի թվի 2-րդ դեմքի համար Futuro Simple-ում անորոշ դերբային ավելացնում ենք «-éis»։"
  },
  {
    id: 6,
    tense: 'Simple',
    difficulty: 'fácil',
    questionText: "Si estudian duro, ellos ________ (lograr) pasar todos los niveles del juego.",
    questionTextArm: "Եֆե ջանասիրաբար սովորեն, նրանք ________ (lograr) կհասնեն խաղի բոլոր մակարդակներն անցնելուն։",
    options: ["lograré", "lograrás", "lograrán", "lograremos"],
    correctIndex: 2,
    explanation: "Para la tercera persona plural (Ellos/Ellas/Ustedes) en Futuro Simple, añadimos '-án' al infinitivo.",
    explanationArm: "Հոգնակի թվի 3-րդ դեմքի համար (Ellos/Ellas) Futuro Simple-ում անորոշ դերբային ավելացնում ենք «-án»։"
  },
  {
    id: 7,
    tense: 'Simple',
    difficulty: 'medio',
    questionText: "Mañana yo ________ (tener) una cita con mi nuevo profesor de español.",
    questionTextArm: "Վաղը ես ________ (tener) հանդիպում իմ իսպաներենի նոր ուսուցչի հետ։",
    options: ["teneré", "tendré", "tiendré", "tuvé"],
    correctIndex: 1,
    explanation: "El verbo irregular 'tener' cambia su raíz a 'tendr-' en Futuro Simple. Al añadir '-é' para Yo, obtenemos 'tendré'.",
    explanationArm: "«tener» անկանոն բայի հիմքը Futuro Simple-ում փոխվում է «tendr-»-ի։ Yo դեմքի համար ճիշտ ձևն է՝ «tendré»։"
  },
  {
    id: 8,
    tense: 'Simple',
    difficulty: 'medio',
    questionText: "La próxima semana, el carpintero ________ (hacer) una mesa de madera nueva.",
    questionTextArm: "Հաջորդ շաբաթ ատաղձագործը ________ (hacer) նոր փայտե սեղան։",
    options: ["haceré", "hará", "hadrá", "hicé"],
    correctIndex: 1,
    explanation: "La raíz de 'hacer' en Futuro Simple cambia de forma irregular a 'har-'. Para la tercera persona es 'hará'.",
    explanationArm: "«hacer» բայի հիմքը Futuro Simple-ում անկանոն կերպով փոխվում է «har-»-ի։ Երրորդ դեմքի համար ճիշտ ձևն է՝ «hará»։"
  },
  {
    id: 9,
    tense: 'Simple',
    difficulty: 'medio',
    questionText: "Sé que eres honesto, por eso tú ________ (decir) toda la verdad.",
    questionTextArm: "Գիտեմ, որ անկեղծ ես, այդ պատճառով դու ________ (decir) ողջ ճշմարտությունը։",
    options: ["decirás", "decerás", "dirás", "dijiste"],
    correctIndex: 2,
    explanation: "La raíz de 'decir' cambia a 'dir-' en futuro. Para la forma de Tú agregamos '-as', resultando en 'dirás'.",
    explanationArm: "«decir» բայի հիմքը ապառնիում փոխվում է «dir-»-ի, իսկ «Tú» դեմքի համար ավելանում է «-as»՝ ստանալով «dirás»-ը։"
  },
  {
    id: 10,
    tense: 'Simple',
    difficulty: 'medio',
    questionText: "Con bastante práctica, nosotros ________ (poder) dominar el idioma español.",
    questionTextArm: "Բավարար պրակտիկայով մենք ________ (poder) կկարողանանք տիրապետել իսպաներեն լեզվին։",
    options: ["poderemos", "podremos", "puedremos", "podríamos"],
    correctIndex: 1,
    explanation: "En Futuro Simple, la raíz de 'poder' cambia a 'podr-'. Al agregar '-emos' obtenemos 'podremos'.",
    explanationArm: "Futuro Simple-ում «poder» բայի հիմքը փոխվում է «podr-»-ի։ Ավելացնելով «-emos» վերջավորությունը՝ ստանում ենք «podremos»։"
  },
  {
    id: 11,
    tense: 'Simple',
    difficulty: 'medio',
    questionText: "Ellos ________ (salir) de viaje muy temprano mañana por la mañana.",
    questionTextArm: "Նրանք վաղը առավոտյան շատ վաղ ________ (salir) ճանապարհորդության։",
    options: ["salirán", "saldrán", "salerán", "saldremos"],
    correctIndex: 1,
    explanation: "El verbo 'salir' tiene raíz irregular 'saldr-' en Futuro Simple. Para Ellos obtenemos 'saldrán'.",
    explanationArm: "«salir» բայն ունի «saldr-» անկանոն հիմքը Futuro Simple-ում։ Նրանց (Ellos) ձևը կլինի՝ «saldrán»։"
  },
  {
    id: 12,
    tense: 'Simple',
    difficulty: 'difícil',
    questionText: "En el futuro, yo ________ (querer) aprender más dialectos hispanos.",
    questionTextArm: "Ապագայում ես ________ (querer) ցանկանալու եմ սովորել ավելի շատ իսպանական բարբառներ։",
    options: ["quereré", "querré", "quieré", "quisé"],
    correctIndex: 1,
    explanation: "El verbo irregular 'querer' tiene raíz 'querr-' en Futuro Simple. Para la primera persona singular (Yo) es 'querré'.",
    explanationArm: "«querer» անկանոն բայն ունի «querr-» հիմքը Futuro Simple-ում։ Եզակի թվի 1-ին դեմքի (Yo) համար այն դառնում է «querré»։"
  },
  {
    id: 13,
    tense: 'Perfecto',
    difficulty: 'fácil',
    questionText: "Para hoy a las ocho de la noche, yo ya ________ (terminar) mis tareas escolares.",
    questionTextArm: "Այսօր երեկոյան ժամը ութին ես արդեն ________ (terminar) կլինեմ իմ դպրոցական առաջադրանքները։",
    options: ["habré terminado", "habré terminando", "habrás terminado", "habremos terminado"],
    correctIndex: 0,
    explanation: "El Futuro Perfecto se forma con la forma correspondiente del auxiliar 'haber' en Futuro Simple más el participio ('terminado'). Para Yo es 'habré terminado'.",
    explanationArm: "Futuro Perfecto-ն կազմվում է Futuro Simple-ում «haber» օժանդակ բայի համապատասխան ձևով և դերբայով («terminado»)։ Yo դեմքի համար կլինի՝ «habré terminado»։"
  },
  {
    id: 14,
    tense: 'Perfecto',
    difficulty: 'fácil',
    questionText: "Para cuando empiece la ronda de preguntas, tú ya ________ (estudiar) las reglas básicas.",
    questionTextArm: "Մինչ հարցերի փուլի սկսվելը, դու արդեն ________ (estudiar) կլինես հիմնական կանոնները։",
    options: ["habré estudiado", "habrás estudiado", "habrá estudiado", "habremos estudiado"],
    correctIndex: 1,
    explanation: "La segunda persona singular (Tú) usa el auxiliar 'habrás', seguido del participio regular 'estudiado'.",
    explanationArm: "Եզակի թվի 2-րդ դեմքի (Tú) համար օգտագործվում է «habrás» օժանդակ բայը և կանոնավոր դերբայը՝ «habrás estudiado»։"
  },
  {
    id: 15,
    tense: 'Perfecto',
    difficulty: 'fácil',
    questionText: "Para las cinco de la tarde, mi madre ya ________ (regresar) de su oficina.",
    questionTextArm: "Կեսօրից հետո ժամը հինգին մայրս արդեն ________ (regresar) կլինի իր գրասենյակից։",
    options: ["habré regresado", "habrá regresado", "habrán regresado", "regresará"],
    correctIndex: 1,
    explanation: "Para la tercera persona singular (mi madre / ella), el auxiliar correspondiente es 'habrá', componiendo la frase 'habrá regresar'.",
    explanationArm: "Եզակի թվի 3-րդ դեմքի (մայրս / ella) համար ճիշտ օժանդակ բայն է «habrá»՝ կազմելով «habrá regresado» արտահայտությունը։"
  },
  {
    id: 16,
    tense: 'Perfecto',
    difficulty: 'fácil',
    questionText: "Para el próximo año, nosotros ya ________ (viajar) por toda Sudamérica.",
    questionTextArm: "Հաջորդ տարի մենք արդեն ________ (viajar) ճանապարհորդած կլինենք ողջ Հարավային Ամերիկայով։",
    options: ["habremos viajado", "habremos viajando", "habré viajado", "habrán viajado"],
    correctIndex: 0,
    explanation: "La primera persona plural (Nosotros) usa el auxiliar 'habremos', acoplado al participio regular en '-ado' del verbo viajar.",
    explanationArm: "Հոգնակի թվի 1-ին դեմքը (Nosotros) օգտագործում է «habremos» օժանդակ բայը և viajar բայի կանոնավոր դերբայը՝ «viajado»։"
  },
  {
    id: 17,
    tense: 'Perfecto',
    difficulty: 'medio',
    questionText: "Antes de que acabe el día, los estudiantes ya ________ (completar) el proyecto de clase.",
    questionTextArm: "Մինչ օրվա ավարտը ուսանողները արդեն ________ (completar) կլինեն դասարանական նախագիծը։",
    options: ["habrán completado", "habré completado", "habremos completado", "habrán completando"],
    correctIndex: 0,
    explanation: "Para la tercera persona plural (Ellos / los estudiantes), usamos 'habrán' seguido del participio: 'habrán completado'.",
    explanationArm: "Հոգնակի թվի 3-րդ դեմքի (Ellos / ուսանողները) համար օգտագործում ենք «habrán» օժանդակ բայը և դերբայը՝ «habrán completado»։"
  },
  {
    id: 18,
    tense: 'Perfecto',
    difficulty: 'medio',
    questionText: "Para el siguiente lunes, yo ya ________ (hacer) todas mis tareas de español.",
    questionTextArm: "Հաջորդ երկուշաբթի ես արդեն ________ (hacer) կլինեմ իմ իսպաներենի բոլոր տնայինները։",
    options: ["habré hecho", "habré hacido", "habré hacer", "haré hecho"],
    correctIndex: 0,
    explanation: "El verbo 'hacer' tiene un participio irregular: 'hecho'. Con el pronombre Yo, la forma compuesta de Futuro Perfecto es 'habré hecho'.",
    explanationArm: "«hacer» բայն ունի անկանոն դերբայ՝ «hecho»։ Yo դեմքի համար Futuro Perfecto-ի բաղադրյալ ձևն է՝ «habré hecho»։"
  },
  {
    id: 19,
    tense: 'Perfecto',
    difficulty: 'medio',
    questionText: "Para cuando ella te pregunte, tú ya le ________ (decir) la verdad.",
    questionTextArm: "Մինչ նրա հարցնելը, դու արդեն նրան ________ (decir) կլինես ճշմարտությունը։",
    options: ["habrás decido", "habrás dicho", "habrás decir", "dirás dicho"],
    correctIndex: 1,
    explanation: "El participio del verbo 'decir' es irregular: 'dicho'. La conjugación para Tú en Futuro Perfecto es 'habrás dicho'.",
    explanationArm: "«decir» բայի դերբայը անկանոն է՝ «dicho»։ Tú դեմքի համար Futuro Perfecto-ի խոնարհումն է՝ «habrás dicho»։"
  },
  {
    id: 20,
    tense: 'Perfecto',
    difficulty: 'medio',
    questionText: "Para mañana en la tarde, la autora ya ________ (escribir) el primer capítulo.",
    questionTextArm: "Վաղը կեսօրից հետո հեղինակն արդեն ________ (escribir) կլինի առաջին գլուխը։",
    options: ["habrá escribido", "habrá escrito", "escribirá", "habrá escreto"],
    correctIndex: 1,
    explanation: "El verbo 'escribir' tiene un participio irregular: 'escrito'. Para Ella se construye como 'habrá escrito'.",
    explanationArm: "«escribir» բայն ունի անկանոն դերբայ՝ «escrito»։ Ella (նա / հեղինակը) դեմքի համար կառուցվում է որպես «habrá escrito»։"
  },
  {
    id: 21,
    tense: 'Perfecto',
    difficulty: 'medio',
    questionText: "Para el final de esta noche, nosotros ya ________ (ver) la película entera.",
    questionTextArm: "Մինչ այսօրվա գիշերվա ավարտը մենք արդեն ________ (ver) կլինենք ֆիլմն ամբողջությամբ։",
    options: ["habremos visto", "habremos vido", "habremos ver", "veremos visto"],
    correctIndex: 0,
    explanation: "El participio pasivo del verbo 'ver' es irregular: 'visto'. Para la primera persona plural es 'habremos visto'.",
    explanationArm: "«ver» բայի կրավորական դերբայը անկանոն է՝ «visto»։ Հոգնակի թվի 1-ին դեմքի համար ճիշտ ձևն է՝ «habremos visto»։"
  },
  {
    id: 22,
    tense: 'Perfecto',
    difficulty: 'difícil',
    questionText: "Si dejas caer esa hermosa taza, para mañana se ________ (romper) en pedazos.",
    questionTextArm: "Եթե թույլ տաս այդ գեղեցիկ բաժակն ընկնի, վաղը այն արդեն կտոր-կտոր ________ (romper) կլինի։",
    options: ["habrá rompido", "habrá roto", "habrán roto", "romperá"],
    correctIndex: 1,
    explanation: "El participio del verbo 'romper' es exclusivamente el irregular 'roto' (rompido es un error). Para la taza (singular) es 'habrá roto'.",
    explanationArm: "«romper» բայի դերբայը բացառապես անկանոն «roto» ձևն է («rompido»-ն սխալ է)։ Բաժակի (եզակի թիվ) համար կլինի՝ «habrá roto»։"
  },
  {
    id: 23,
    tense: 'Perfecto',
    difficulty: 'difícil',
    questionText: "Para el inicio de la fiesta, vosotros ya ________ (poner) la mesa y los platos.",
    questionTextArm: "Խնջույքի սկզբում դուք արդեն ________ (poner) պատրաստած կլինեք սեղանն ու ափսեները։",
    options: ["habréis ponido", "habréis puesto", "puestos", "habréis poner"],
    correctIndex: 1,
    explanation: "El participio irregular de 'poner' es 'puesto'. Al conjugar con Vosotros en Futuro Perfecto, formamos 'habréis puesto'.",
    explanationArm: "«poner» բայի անկանոն դերբայն է՝ «puesto»։ Vosotros դեմքի համար Futuro Perfecto-ում կլինի՝ «habréis puesto»։"
  },
  {
    id: 24,
    tense: 'Perfecto',
    difficulty: 'difícil',
    questionText: "No te preocupes, para el miércoles yo ya ________ (volver) de mi viaje de negocios.",
    questionTextArm: "Մի՛ մտահոգվիր, մինչև չորեքշաբթի ես արդեն ________ (volver) վերադարձած կլինեմ իմ գործուղումից։",
    options: ["habré vuelvo", "habré volvido", "habré vuelto", "volveré vuelto"],
    correctIndex: 2,
    explanation: "El participio del verbo 'volver' es irregular: 'vuelto'. Estructurado con Yo obtenemos 'habré vuelto'.",
    explanationArm: "«volver» բայի դերբայը անկանոն է՝ «vuelto»։ Yo դեմքի համար ստանում ենք «habré vuelto» ձևը։"
  },
  {
    id: 25,
    tense: 'Perfecto',
    difficulty: 'difícil',
    questionText: "Para cuando la gente se despierte, los panaderos ya ________ (abrir) la tienda.",
    questionTextArm: "Երբ մարդիկ արթնանան, փռապաններն արդեն ________ (abrir) բացած կլինեն խանութը։",
    options: ["habrán abrido", "habrán abierto", "abrirán", "habrán abrierto"],
    correctIndex: 1,
    explanation: "El verbo 'abrir' tiene un participio irregular: 'abierto'. Al referirnos a los panaderos (ellos), la forma es 'habrán abierto'.",
    explanationArm: "«abrir» բայն ունի անկանոն դերբայ՝ «abierto»։ Փռապանների (ellos - նրանք) համար ճիշտ ձևն է՝ «habrán abierto»։"
  }
];
