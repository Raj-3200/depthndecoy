import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import Layout from "@/components/layout/Layout";
import philosophyImage from "@/assets/philosophy-image.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const values = [
  {
    title: "Depth Over Noise",
    description:
      "In a world of fast fashion and louder logos, we choose substance. Every stitch, every cut, every fabric choice is deliberate.",
  },
  {
    title: "Shadow Craftsmanship",
    description:
      "Our pieces work in the background of your presence, enhancing without overwhelming. True luxury whispers.",
  },
  {
    title: "Considered Design",
    description:
      "We reject trends for timelessness. Each garment is engineered to outlast seasons and grow more refined with wear.",
  },
];

const faqItems = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 5–7 business days. Express options are available at checkout for 2–3 day delivery.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and have all original tags attached. Refunds are processed within 5–7 business days after we receive the return.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we ship across India and internationally. Free shipping on orders over ₹5,000. International duties and taxes may apply and are the responsibility of the buyer.",
  },
  {
    q: "How do I find my size?",
    a: "Refer to our size guide below. If you're between sizes, we recommend sizing up for a relaxed fit or down for a tailored look.",
  },
  {
    q: "Can I cancel or modify my order?",
    a: "Orders can be modified or cancelled within 2 hours of placement. After that, the order enters processing and cannot be changed.",
  },
];

const sizeChart = [
  { size: "S", chest: '36–38"', waist: '28–30"', length: '27"' },
  { size: "M", chest: '38–40"', waist: '30–32"', length: '28"' },
  { size: "L", chest: '40–42"', waist: '32–34"', length: '29"' },
  { size: "XL", chest: '42–44"', waist: '34–36"', length: '30"' },
  { size: "XXL", chest: '44–46"', waist: '36–38"', length: '31"' },
];

const About = () => {
  const location = useLocation();

  // Scroll to hash section on navigation
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [location.hash]);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
              The Story
            </p>
            <h1 className="text-headline text-foreground mb-6">
              Not For The Surface
            </h1>
            <p className="text-lg font-light text-muted-foreground leading-relaxed">
              Depth & Decoy was born from a simple observation: the most powerful
              presences in any room are rarely the loudest. We create menswear for
              those who understand this truth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Image */}
      <section className="pb-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[16/9] md:aspect-[21/9]"
          >
            <img
              src={philosophyImage}
              alt="Depth & Decoy philosophy"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-secondary/50">
        <div className="container-premium">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              Our Philosophy
            </p>
            <h2 className="text-subhead text-foreground">
              The Principles That Guide Us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-10 h-px bg-border mx-auto mb-6" />
                <h3 className="font-display text-lg tracking-[0.08em] text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
                The Beginning
              </p>
              <h2 className="text-subhead text-foreground mb-6">
                Founded in Shadow
              </h2>
              <div className="space-y-5 text-sm font-light text-muted-foreground leading-relaxed">
                <p>
                  Depth & Decoy emerged from the conviction that modern menswear had
                  lost its way. Caught between fast fashion's disposability and
                  luxury's ostentatious displays, men who valued substance had nowhere to turn.
                </p>
                <p>
                  We set out to create something different: garments that command
                  respect through quality and design, not through logos and price tags.
                  Every piece is crafted for men who let their presence speak before their words.
                </p>
                <p>
                  Our name embodies our philosophy. <strong className="text-foreground">Depth</strong> represents substance,
                  craftsmanship, and the unseen qualities that define true style.
                  <strong className="text-foreground"> Decoy</strong> represents the subtle art of presence — appearing effortless
                  while being meticulously considered.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative aspect-[4/5] bg-secondary"
            >
              <img
                src="https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&h=1000&fit=crop&q=80"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section id="shipping" className="py-16 md:py-20 border-t border-border">
        <div className="container-premium max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              Delivery
            </p>
            <h2 className="text-subhead text-foreground">Shipping & Returns</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-6 border border-border">
              <h3 className="font-display text-base tracking-[0.08em] text-foreground mb-3">
                Shipping
              </h3>
              <ul className="space-y-2 text-sm font-light text-muted-foreground">
                <li>• Free shipping on orders over ₹5,000</li>
                <li>• Standard: 5–7 business days</li>
                <li>• Express: 2–3 business days</li>
                <li>• Worldwide delivery available</li>
              </ul>
            </div>
            <div className="p-6 border border-border">
              <h3 className="font-display text-base tracking-[0.08em] text-foreground mb-3">
                Returns
              </h3>
              <ul className="space-y-2 text-sm font-light text-muted-foreground">
                <li>• 14-day return window</li>
                <li>• Items must be unworn with tags</li>
                <li>• Refund within 5–7 business days</li>
                <li>• Free return shipping (US only)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide */}
      <section id="size-guide" className="py-16 md:py-20 bg-secondary/50">
        <div className="container-premium max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              Fit Reference
            </p>
            <h2 className="text-subhead text-foreground">Size Guide</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-normal">
                    Size
                  </th>
                  <th className="py-3 px-4 text-left text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-normal">
                    Chest
                  </th>
                  <th className="py-3 px-4 text-left text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-normal">
                    Waist
                  </th>
                  <th className="py-3 px-4 text-left text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-normal">
                    Length
                  </th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row) => (
                  <tr key={row.size} className="border-b border-border/50">
                    <td className="py-3 px-4 font-display tracking-wider text-foreground">
                      {row.size}
                    </td>
                    <td className="py-3 px-4 font-light text-muted-foreground">
                      {row.chest}
                    </td>
                    <td className="py-3 px-4 font-light text-muted-foreground">
                      {row.waist}
                    </td>
                    <td className="py-3 px-4 font-light text-muted-foreground">
                      {row.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs font-light text-muted-foreground/70 text-center">
            Measurements are approximate. For the best fit, measure your body and compare to the chart above.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-20 border-t border-border">
        <div className="container-premium max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              Questions
            </p>
            <h2 className="text-subhead text-foreground">FAQ</h2>
          </div>

          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border-border">
                <AccordionTrigger className="text-sm text-foreground hover:no-underline py-5 text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm font-light text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 md:py-20 bg-secondary/50">
        <div className="container-premium max-w-3xl text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
            Get In Touch
          </p>
          <h2 className="text-subhead text-foreground mb-5">Contact Us</h2>
          <p className="text-sm font-light text-muted-foreground mb-8 max-w-md mx-auto">
            Have a question, concern, or just want to say hello? We'd love to hear from you.
          </p>
          <a
            href="mailto:depthanddecoy@gmail.com"
            className="inline-flex items-center gap-3 btn-outline"
          >
            <Mail className="w-4 h-4" />
            depthanddecoy@gmail.com
          </a>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="py-16 md:py-20 border-t border-border">
        <div className="container-premium max-w-3xl">
          <h2 className="text-subhead text-foreground mb-6">Privacy Policy</h2>
          <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
            <p>
              Depth & Decoy respects your privacy. We collect only the information necessary to
              process your orders and improve your shopping experience — name, email, shipping address,
              and payment details.
            </p>
            <p>
              We do not sell, rent, or share your personal information with third parties for marketing
              purposes. Your data is processed securely through encrypted connections and stored on
              protected servers.
            </p>
            <p>
              You may request deletion of your data at any time by contacting us at{" "}
              <a href="mailto:depthanddecoy@gmail.com" className="text-foreground underline underline-offset-4">
                depthanddecoy@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* Terms */}
      <section id="terms" className="py-16 md:py-20 bg-secondary/50">
        <div className="container-premium max-w-3xl">
          <h2 className="text-subhead text-foreground mb-6">Terms of Service</h2>
          <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
            <p>
              By using the Depth & Decoy website and placing orders, you agree to these terms of
              service. All products are subject to availability. Prices are listed in USD and may
              change without notice.
            </p>
            <p>
              We reserve the right to cancel any order if fraud is suspected or if products become
              unavailable. In such cases, a full refund will be issued promptly.
            </p>
            <p>
              All content, images, and branding on this site are the intellectual property of
              Depth & Decoy and may not be reproduced without written permission.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-subhead text-foreground mb-5">Enter the Depth</h2>
            <p className="text-lg font-light text-muted-foreground max-w-lg mx-auto mb-10">
              Experience menswear designed for those who understand that true power lies in subtlety.
            </p>
            <Link to="/shop" className="btn-primary">
              Shop the Collection
              <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
