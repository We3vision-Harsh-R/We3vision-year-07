import type { LangPack } from "./types";

const MAIL = "info@we3vision.com";

export const ES: LangPack = {
  code: "es",
  label: "Español",
  ui: {
    legal: "Legal",
    meta: "We3vision Private Limited · Versión {v} · Última actualización {d}",
    placeholder: "Buscar en esta política: datos, cookies, CCPA, brecha, eliminar…",
    clear: "Borrar",
    count: "{t} secciones",
    match: "{n} de {t} secciones coinciden con “{q}”",
    none: "No se encontró nada para “{q}”. Pruebe con otra palabra.",
    contents: "Contenido",
    laws: "Leyes que sigue esta página",
    end: "Esta política explica cómo trabajamos. No es asesoramiento jurídico. Para un proyecto con necesidades legales especiales, firmamos el contrato y el acuerdo de tratamiento de datos que pida su abogado.",
    tagsAria: "Política de privacidad por país",
    langAria: "Idioma",
    searchAria: "Buscar en esta política de privacidad",
    binding: "Esta es una traducción para ayudar a leer. El texto vinculante es la versión en inglés.",
  },
  common: {
    who: {
      title: "Quiénes somos y qué cubre esta página",
      paras: [
        "We3vision Private Limited («We3vision», «nosotros») es una empresa de web, apps, IA, metaverso, UI/UX, CRM, SEO y diseño de marca. Nuestra sede está en Surat, Gujarat, India, y tenemos una oficina en Marburgo, Alemania. Esta página explica cómo tratamos los datos personales: de los visitantes de nuestro sitio, de quienes nos escriben o solicitan empleo, y de los clientes para quienes construimos y operamos proyectos.",
        "Una regla corta lo resume: recogemos solo lo que necesitamos, lo usamos solo para el trabajo para el que se dio, lo protegemos, no lo vendemos, y lo borramos o devolvemos cuando termina el trabajo.",
      ],
    },
    "how-we-work": {
      title: "Cómo trabajamos en un proyecto de cliente",
      paras: ["Todo proyecto sigue los mismos pasos. En cada paso, esto es lo que pasa con los datos:"],
      list: [
        "1. Consulta: usted nos escribe (formulario, correo, teléfono, chat). Guardamos su nombre, datos de contacto y lo que pide, solo para responder y hacer un presupuesto.",
        "2. Acuerdo: firmamos un contrato y, cuando el proyecto trata datos personales de sus clientes o empleados, un acuerdo de tratamiento de datos. Dice qué podemos hacer con los datos y por cuánto tiempo.",
        "3. Diseño y desarrollo: nuestro equipo trabaja con sus requisitos, contenido y, si hace falta, datos de prueba. Pedimos primero datos de prueba o de ejemplo. Los datos reales de clientes se usan solo cuando el proyecto no puede probarse sin ellos y usted está de acuerdo.",
        "4. Pruebas y lanzamiento: el proyecto corre en servidores que usted elige o aprueba. El acceso de nuestro equipo es limitado, nominal y registrado.",
        "5. Soporte y actualizaciones: vemos sus datos en vivo solo cuando pide soporte y solo lo necesario para resolver el problema.",
        "6. Entrega y fin: entregamos el código, el contenido y los datos, y borramos nuestras copias (vea «Cuánto tiempo conservamos los datos»).",
      ],
    },
    "data-we-collect": {
      title: "Qué datos recogemos",
      list: [
        "Visitantes del sitio: páginas visitadas, tipo de dispositivo y navegador, ubicación aproximada según la dirección IP y las cookies descritas abajo.",
        "Personas que nos escriben: nombre, correo, teléfono, empresa, país y el mensaje, del formulario de contacto, chat o correo.",
        "Candidatos a un empleo: el CV, los datos de contacto y lo que el candidato nos envíe.",
        "Clientes: datos de la empresa y de facturación, nombres y contactos del equipo del cliente, archivos del proyecto y las cuentas que necesitamos para trabajar en él.",
        "Datos de los clientes o empleados de un cliente, que este nos permite tratar dentro de un proyecto (vea las dos secciones siguientes). No recogemos estos datos para nosotros.",
      ],
      paras: [
        "No pedimos datos sensibles (salud, religión, opinión política, datos biométricos, contraseñas de cuentas privadas) para nuestros fines. Si un proyecto los necesita, el cliente nos lo dice por escrito y aplicamos reglas más estrictas.",
      ],
    },
    "client-data-store": {
      title: "Cómo guardamos los datos de un cliente",
      paras: ["Los datos de un cliente pertenecen al cliente. Los guardamos así:"],
      list: [
        "Dónde: en los servidores o cuentas propios del cliente cuando es posible; si no, en servidores del proyecto que el cliente aprueba. El lugar (país) consta en el contrato.",
        "Quién puede abrirlos: solo miembros nombrados del equipo del proyecto, cada uno con cuenta personal. Sin contraseñas compartidas. Cuando alguien deja el proyecto o la empresa, el acceso se cierra de inmediato.",
        "Cómo se protegen: conexiones cifradas (HTTPS/TLS), contraseñas fuertes con inicio de sesión en dos pasos cuando la herramienta lo tiene, copias de trabajo separadas por cliente y actualizaciones regulares del software.",
        "Sin lugares privados: los datos del cliente no se guardan en teléfonos personales, correos privados ni nubes personales.",
        "Copias de seguridad: solo donde el proyecto las necesita, con la misma protección, y se eliminan según un calendario.",
        "Registros: llevamos un registro de quién accedió a qué y tenemos un plan escrito para una brecha de datos.",
      ],
    },
    "client-data-use": {
      title: "Dónde se usan los datos de un cliente",
      paras: ["Los datos de un cliente se usan solo en estos lugares, y en ningún otro:"],
      list: [
        "Para construir y probar el proyecto que el cliente encargó (sitio web, app, CRM, herramienta de IA, tienda, mundo VR/AR, diseño).",
        "Para operar, alojar y dar soporte al proyecto tras el lanzamiento, cuando el cliente lo pide.",
        "Para corregir un fallo, hallar la causa de un problema y mejorar la seguridad de ese proyecto.",
        "Para cumplir una obligación legal (por ejemplo cuando un tribunal o autoridad lo pide de forma legal).",
        "NO usamos los datos de un cliente para entrenar nuestros propios modelos de IA, hacer nuestra publicidad, venderlos a otros ni para el proyecto de otro cliente. Si una herramienta de IA del proyecto trata los datos, usamos solo las herramientas que el cliente aprobó y se le dice cuál es.",
      ],
    },
    "our-own-use": {
      title: "Dónde se usan nuestros propios datos (visitantes, consultas, candidatos)",
      list: [
        "Para responderle y hacer un presupuesto.",
        "Para operar, proteger y mejorar nuestro sitio (hallar errores, frenar spam y ataques, ver qué páginas son útiles).",
        "Para valorar una solicitud de empleo.",
        "Para enviarle novedades de nuestro trabajo, solo si usted aceptó y con un enlace para darse de baja.",
        "Para llevar la contabilidad, los impuestos y los contratos que exige la ley.",
      ],
    },
    sharing: {
      title: "Con quién compartimos datos",
      paras: [
        "No vendemos datos personales. Los compartimos solo con: miembros de nuestro equipo que los necesitan; proveedores que trabajan para nosotros bajo contrato (alojamiento, correo, herramientas de proyecto, pagos, analítica) y que solo pueden usarlos para nosotros; el cliente para cuyo proyecto los tratamos; y autoridades cuando la ley lo exige.",
        "Un proveedor que guarda datos de un cliente se llama subencargado. Avisamos al cliente antes de usar uno y el contrato le impone los mismos deberes que a nosotros. La lista está disponible a petición.",
      ],
    },
    retention: {
      title: "Cuánto tiempo conservamos los datos",
      list: [
        "Consultas que no se convierten en proyecto: hasta 24 meses, luego se borran.",
        "Solicitudes de empleo: hasta 12 meses tras cubrirse el puesto, salvo que el candidato acepte que las guardemos más tiempo.",
        "Contratos, facturas y registros fiscales: el tiempo que exija la ley del lugar (en India, normalmente 8 años).",
        "Copias de trabajo del proyecto y datos de un cliente: se borran o se devuelven al cliente en 90 días tras terminar el proyecto o antes si el cliente lo pide por escrito. Las copias de seguridad desaparecen en 30 días más. Si el contrato dice otra cosa, manda el contrato.",
        "Registros de servidores y del sitio: normalmente hasta 12 meses.",
      ],
      paras: ["Solo conservamos datos más tiempo si una ley lo exige o por una reclamación legal, y entonces solo la parte necesaria."],
    },
    security: {
      title: "Seguridad y brechas de datos",
      paras: [
        "Protegemos los datos con las medidas anteriores y las mejoramos con el tiempo. Ningún sistema es 100 % seguro. Si hallamos una brecha que afecta a sus datos, avisamos al cliente sin demora (dentro de las 24 horas de descubrirla) y damos los hechos que necesita para informar a la autoridad y a las personas, como exige la ley del país.",
      ],
    },
    transfers: {
      title: "Datos entre países",
      paras: [
        "Nuestro equipo de desarrollo trabaja desde India y tenemos una oficina en Alemania. Por eso los datos de un cliente pueden verse o tratarse en India o Alemania y en los servidores que el cliente apruebe. Cuando la ley del país del cliente limita esa transferencia, usamos la herramienta que esa ley pide (por ejemplo cláusulas contractuales tipo) y se lo decimos en la página del país.",
      ],
    },
    cookies: {
      title: "Cookies",
      paras: [
        "Nuestro sitio usa las cookies que necesita para funcionar (por ejemplo para recordar sus elecciones). Donde la ley exige su consentimiento para otras cookies, preguntamos antes y usted puede cambiar de opinión en cualquier momento en su navegador. No usamos cookies para vender datos.",
      ],
    },
    children: {
      title: "Menores",
      paras: [
        "Nuestro sitio y servicios son para empresas y no para menores. No recogemos a sabiendas datos de menores de 13 años (o la edad que fije la ley de su país). Si el proyecto de un cliente está dirigido a menores, el cliente debe obtener el consentimiento de los padres y construimos los pasos en el proyecto. Si cree que un menor nos envió datos, escríbanos y los borramos.",
      ],
    },
    changes: {
      title: "Cambios en esta política",
      paras: [
        "Cuando cambian la ley o nuestra forma de trabajar, actualizamos esta página y la fecha de arriba. Para un cambio grande avisamos a nuestros clientes por correo. Las versiones anteriores están disponibles a petición.",
      ],
    },
    contact: {
      title: "Contacto",
      paras: [
        `We3vision Private Limited, Surat, Gujarat, India. Correo: ${MAIL}. Teléfono: +91 7383216096. Nuestra oficina alemana está en Marburgo: vea la dirección en la página de Contacto. Escriba «Privacy request» en el asunto. Si no está conforme con nuestra respuesta, puede reclamar ante la autoridad de protección de datos de su país (nombrada en la página de su país).`,
      ],
    },
  },
  regions: {
    usa: {
      title: "Política de privacidad para clientes de Estados Unidos",
      intro:
        "Estados Unidos no tiene una sola ley de privacidad. Hay leyes estatales (primero California), leyes para datos especiales (salud, menores, finanzas) y las reglas de la Comisión Federal de Comercio (FTC). Esta página dice a clientes y visitantes de EE. UU. qué hacemos bajo ellas cuando construimos un proyecto para una empresa estadounidense.",
      laws: [
        "Ley de Privacidad del Consumidor de California modificada por la CPRA (CCPA/CPRA)",
        "Leyes estatales de privacidad de Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), Texas (TDPSA), Oregón, Montana y los demás estados que tienen una",
        "Ley de Protección de la Privacidad de los Niños en Línea (COPPA)",
        "Ley HIPAA, solo cuando se firma un Acuerdo de Asociado Comercial",
        "Ley Gramm-Leach-Bliley (GLBA), solo para proyectos de servicios financieros",
        "Sección 5 de la Ley de la FTC (sin prácticas desleales o engañosas) y las leyes de brechas de datos de cada estado",
      ],
      sections: {
        "us-sell": {
          title: "No vendemos sus datos",
          paras: [
            "No vendemos información personal ni la compartimos para publicidad conductual entre contextos. No lo hemos hecho en los últimos 12 meses. Los datos de los clientes de nuestro cliente se usan solo para construir, operar y dar soporte al proyecto del cliente.",
          ],
        },
        "us-ccpa": {
          title: "Derechos en California y otros estados",
          paras: ["Si vive en California, Virginia, Colorado, Connecticut, Utah, Texas, Oregón u otro estado con ley de privacidad, tiene estos derechos:"],
          list: [
            "Saber y acceder a la información personal que tenemos sobre usted.",
            "Eliminarla y corregirla cuando sea errónea.",
            "Optar por no participar en la venta, el uso compartido para publicidad y la elaboración de perfiles. (No hacemos esto, así que no hay nada de qué salirse, pero puede preguntar igualmente.)",
            "Limitar el uso de información personal sensible.",
            "No recibir peor trato por usar un derecho.",
            "Apelar nuestra respuesta (en los estados que dan derecho de apelación). Escriba a la misma dirección y diga «Appeal».",
          ],
          note: `Para usar un derecho: escriba a ${MAIL} con el asunto «Privacy request». Comprobamos que la solicitud viene de usted (normalmente respondiendo desde el mismo correo) y respondemos en 45 días (podemos ampliar una vez 45 días más y le diremos por qué).`,
        },
        "us-role": {
          title: "Nuestro papel: proveedor de servicios o encargado",
          paras: [
            "Cuando construimos u operamos un proyecto para una empresa de EE. UU., el cliente decide por qué y cómo se usan los datos de sus clientes. Actuamos como su «proveedor de servicios» (California) o «encargado» (otros estados). Tratamos los datos solo según las instrucciones escritas del cliente, no los combinamos con otros datos, no los usamos para fines propios y firmamos un acuerdo escrito que lo dice (adenda de tratamiento de datos).",
          ],
        },
        "us-health": {
          title: "Salud, finanzas y menores",
          list: [
            "Datos de salud (HIPAA): no aceptamos información de salud protegida a menos que se firme antes un Acuerdo de Asociado Comercial y el proyecto esté preparado para ello.",
            "Datos financieros (GLBA): para bancos, prestamistas y clientes similares seguimos el programa escrito de seguridad de la información del cliente.",
            "Menores (COPPA): nuestro sitio no es para menores de 13 años. Si el proyecto de un cliente es para menores, el cliente debe obtener el consentimiento de los padres y construimos los pasos de consentimiento en el proyecto.",
          ],
        },
        "us-breach": {
          title: "Si hay una brecha de datos",
          paras: [
            "Avisamos al cliente sin demora indebida (y dentro de las 72 horas de saberlo para una brecha confirmada) para que cumpla las leyes de brechas de sus estados, que tienen plazos propios. El cliente decide a quién se informa y nosotros ayudamos con los hechos.",
          ],
        },
        "us-transfer": {
          title: "Los datos van a India",
          paras: [
            "Nuestro equipo de desarrollo trabaja desde India, por lo que los datos del cliente pueden verse desde India. Lo decimos a los clientes de EE. UU. antes de empezar el proyecto y lo escribimos en el contrato. Cuando el cliente necesita que los datos permanezcan en Estados Unidos, trabajamos en servidores que el cliente controla en Estados Unidos y nuestro equipo se conecta con cuentas nominales.",
          ],
        },
      },
    },
  },
};
