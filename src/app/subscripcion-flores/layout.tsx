
export default function Layout({ children }: { children: React.ReactNode }) {

  const faqData = [
    {
      question: "¿Qué incluye la suscripción quincenal de flores?",
      answer: "Nuestra suscripción quincenal incluye: diseño personalizado de arreglos florales, flores frescas de temporada, entrega a domicilio en CABA y GBA, instalación profesional, mantenimiento y asesoramiento floral continuo."
    },
    {
      question: "¿Cuál es el precio de la suscripción quincenal de flores?",
      answer: "Los precios de nuestras suscripciones quincenales comienzan desde $15.000 ARS. El costo varía según el tamaño y complejidad de los arreglos florales, la cantidad de locaciones y la duración del contrato de suscripción."
    },
    {
      question: "¿En qué zonas ofrecen el servicio de suscripción floral?",
      answer: "Ofrecemos nuestro servicio en toda la Ciudad Autónoma de Buenos Aires (CABA) y Gran Buenos Aires (GBA). Para otras localidades, contáctenos para verificar disponibilidad."
    },
    {
      question: "¿Puedo elegir qué tipo de flores quiero en mi suscripción?",
      answer: "Sí, trabajamos con cada cliente para entender sus preferencias. Aunque trabajamos principalmente con flores de temporada para garantizar frescura y calidad, podemos adaptarnos a sus gustos específicos en colores, estilos y variedades disponibles."
    },
    {
      question: "¿Cómo funciona el servicio para empresas?",
      answer: "Para empresas, realizamos una evaluación inicial de los espacios, desarrollamos una propuesta personalizada, establecemos un calendario de renovación quincenal, y nos encargamos de toda la logística, instalación y mantenimiento. Ofrecemos facturación electrónica y opciones de contrato a medida."
    },
    {
      question: "¿Puedo cancelar o pausar mi suscripción?",
      answer: "Sí, nuestras suscripciones son flexibles. Puede pausar o cancelar con un aviso previo de 7 días. Los contratos tienen un período mínimo inicial de 3 meses para garantizar la mejor tarifa."
    },
    {
      question: "¿Qué sucede si no estoy cuando entregan las flores?",
      answer: "Coordinamos previamente día y horario de entrega. Si surge algún imprevisto, puede designar a una persona autorizada para recibir las flores o reprogramar la entrega sin costo adicional con 24 horas de anticipación."
    },
    {
      question: "¿Ofrecen servicios adicionales con la suscripción?",
      answer: "Sí, ofrecemos servicios complementarios como decoración especial para eventos corporativos, cambios de diseño según temporadas o festividades y asesoramiento en decoración botánica para sus espacios."
    },
    {
      question: "¿Qué tipos de flores utilizan en los arreglos quincenales?",
      answer: "Utilizamos flores frescas de temporada como rosas, liliums, lisianthus, gerberas, peonías (en temporada), fresias, tulipanes, alstroemerias, entre otras. La selección varía según disponibilidad y temporada para garantizar siempre la máxima frescura y durabilidad."
    },
    {
      question: "¿Cómo se realiza el mantenimiento de las flores durante los 15 días?",
      answer: "Nuestros arreglos están diseñados para mantenerse frescos durante el período quincenal. Además, proporcionamos instrucciones de cuidado específicas para cada composición y ofrecemos seguimiento periódico. Si alguna flor se deteriora antes de tiempo, realizamos reposiciones sin cargo adicional."
    }
  ];

  return (
    <main>

      {children}

        {/* Sección visible de FAQs */}
        <section className="preguntas-frecuentes my-8 max-w-4xl mx-auto px-4">
        <h2 className="titulo-principal text-2xl font-bold text-center mb-6">Preguntas Frecuentes - Suscripción de ENVIO FLORES</h2>
        <div className="grid gap-6">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Sección de beneficios */}
      <section className="beneficios-servicio my-8 max-w-4xl mx-auto px-4 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Beneficios de Nuestra Suscripción </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="benefit-card p-4">
            <h3 className="font-semibold text-lg mb-2">Flores Siempre Frescas</h3>
            <p>Renovamos tus arreglos cada 15 días con flores de temporada seleccionadas por su frescura y durabilidad.</p>
          </div>
          <div className="benefit-card p-4">
            <h3 className="font-semibold text-lg mb-2">Diseño Personalizado</h3>
            <p>Creamos composiciones exclusivas adaptadas a tu espacio, estilo y preferencias personales.</p>
          </div>
          <div className="benefit-card p-4">
            <h3 className="font-semibold text-lg mb-2">Instalación Profesional</h3>
            <p>Nuestro equipo se encarga de instalar los arreglos en los lugares óptimos de tu espacio.</p>
          </div>
          <div className="benefit-card p-4">
            <h3 className="font-semibold text-lg mb-2">Mantenimiento Sin Preocupaciones</h3>
            <p>Nos encargamos de todo el mantenimiento y reemplazo de las flores durante la suscripción.</p>
          </div>
        </div>
      </section>
    </main>
  )
}