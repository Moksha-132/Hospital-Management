import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import About from '../components/About';
import Services from '../components/Services';
import TopDoctors from '../components/TopDoctors';

const Home = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <About />
      <Services />
      <Features />
      <TopDoctors />
    </>
  );
};

export default Home;
