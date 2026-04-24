import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Projects from './components/Projects';
import SkillsAboutContact from './components/SkillsAboutContact';
import Testimonial from './components/Testimonial';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background relative overflow-clip">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Header />
      <div className="w-full flex justify-center">
        <main className="w-full max-w-[1440px] px-6 md:px-12 flex flex-col gap-12 py-4">
          <Hero />
          <Stats />
          <Projects />
          <SkillsAboutContact />
          <Testimonial />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
