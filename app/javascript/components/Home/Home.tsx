import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import CallToActionSection from "./CallToActionSection";
import Layout from "../Layout/Layout";

function Home() {
	return (
		<Layout>
			<div className="px-10">
				<HeroSection />

				<FeaturesSection />

				<HowItWorksSection />

				<CallToActionSection />
			</div>
		</Layout>
	);
}

export default Home;
