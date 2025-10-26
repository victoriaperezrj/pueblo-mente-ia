import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'María González',
      role: 'Fundadora',
      company: 'TechStart Buenos Aires',
      content: 'Gracias al validador de ideas pude confirmar que mi proyecto era viable antes de invertir. Ahorré meses de trabajo y $200,000 ARS en costos.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      role: 'CEO',
      company: 'Marketing Digital Pro',
      content: 'Las herramientas de optimización me ayudaron a duplicar mis ventas en 6 meses. El análisis de precios fue un game-changer total.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      id: 3,
      name: 'Laura Fernández',
      role: 'Directora',
      company: 'Consultora Estratégica',
      content: 'El dashboard de KPIs me permitió tener visibilidad completa de mi empresa. Ahora tomo decisiones basadas en datos reales, no intuición.',
      rating: 5,
      avatar: '👩‍💻'
    },
    {
      id: 4,
      name: 'Diego Martínez',
      role: 'Emprendedor',
      company: 'FoodTech Startup',
      content: 'Arranqué con solo una idea y la plataforma me guió paso a paso. En 3 meses ya tenía mi primer cliente pagando.',
      rating: 5,
      avatar: '👨‍🍳'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-muted-foreground">
            Más de 1,000 emprendedores confían en nosotros
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-3xl p-12 shadow-2xl relative"
            >
              <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20" />
              
              <div className="flex items-start gap-6 mb-8">
                <div className="text-6xl">{testimonials[currentIndex].avatar}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">{testimonials[currentIndex].name}</h3>
                  <p className="text-muted-foreground mb-2">
                    {testimonials[currentIndex].role} en {testimonials[currentIndex].company}
                  </p>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                "{testimonials[currentIndex].content}"
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full w-12 h-12 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full w-12 h-12 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
