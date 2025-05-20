import React from "react";
import Header from "../Layout/Header";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import CallToActionSection from "./CallToActionSection";
import Footer from "../Layout/Footer";

function Home() {
	return (
		<div className="bg-background text-foreground min-h-screen">
			<Header />

			<div className="px-10">
				<HeroSection />

				<FeaturesSection />

				<HowItWorksSection />

				<CallToActionSection />
			</div>

			<Footer />
		</div>
	);
}

export default Home;
