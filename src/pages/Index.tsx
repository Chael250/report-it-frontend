
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Report-It</h1>
          <p className="text-white/80 mt-2">Community complaint management system</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <section className="text-center space-y-4 py-10">
            <h2 className="text-3xl font-bold">Community Complaint Portal</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              An efficient way to report and track complaints to various government agencies.
              Help improve your community by reporting issues that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button 
                size="lg"
                onClick={() => navigate("/complaints")}
                className="flex items-center gap-2"
              >
                View Complaints
                <ArrowRight size={16} />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/agencies")}
              >
                View Agencies
              </Button>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Submit Complaints</h3>
              <p className="text-gray-500 mb-4">
                Easily submit complaints to any registered government agency.
              </p>
              <Button variant="link" onClick={() => navigate("/complaints/new")}>
                Submit a complaint
              </Button>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-500 mb-4">
                Monitor the status of your submissions and receive updates.
              </p>
              <Button variant="link" onClick={() => navigate("/complaints")}>
                View complaint status
              </Button>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Agency Directory</h3>
              <p className="text-gray-500 mb-4">
                Browse the complete list of agencies that handle community issues.
              </p>
              <Button variant="link" onClick={() => navigate("/agencies")}>
                Browse agencies
              </Button>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-muted p-6">
        <div className="container mx-auto text-center text-gray-500">
          <p>© 2025 Report-It Express. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
