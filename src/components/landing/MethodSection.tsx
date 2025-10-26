import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const MethodSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Registrate gratis',
      description: 'Creá tu cuenta en menos de 1 minuto. No necesitás tarjeta de crédito.'
    },
    {
      number: 2,
      title: 'Contanos tu situación',
      description: 'Respondé 3 preguntas simples y nuestra IA analizará tu etapa emprendedora.'
    },
    {
      number: 3,
      title: 'Accedé a tus herramientas',
      description: 'Usá las herramientas específicas para tu etapa y comenzá a crecer.'
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-muted-foreground">
            Tres pasos simples para comenzar tu viaje emprendedor
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-success" />

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.div
                  className="relative z-10"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Number Circle */}
                  <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </motion.div>

                  {/* Checkmark Animation */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>

                  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-bold mb-3 text-center">{step.title}</h3>
                    <p className="text-muted-foreground text-center">{step.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
