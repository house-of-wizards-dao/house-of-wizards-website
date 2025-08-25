import NextImage from "next/image";
import { useState, FormEvent } from "react";

import DefaultLayout from "@/layouts/default";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ErrorBoundary from "@/components/ErrorBoundary";

const teamMembers = [
  {
    name: "Acid",

    image: "/img/council/acid.png",
  },
  {
    name: "Bridge",

    image: "/img/council/bridge.png",
  },
  {
    name: "DFI",

    image: "/img/council/dfi.png",
  },
  {
    name: "MeepleDad",

    image: "/img/council/meeple.png",
  },
  {
    name: "Madotsuki",

    image: "/img/council/madotsuki.png",
  },
  {
    name: "Meph",

    image: "/img/council/R Y F.png",
  },
  {
    name: "SharkChild",

    image: "/img/council/sharkchild.png",
  },
  {
    name: "Sharon",

    image: "/img/council/sharon.png",
  },
  {
    name: "TadMajor",

    image: "/img/council/jitcy.png",
  },
  {
    name: "R3ptar",

    image: "/img/council/reptar.png",
  },
];

export default function IndexPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setSubmitStatus("error");
      setErrorMessage("Please fill in all fields");

      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form on success
      setFormData({ name: "", email: "", message: "" });
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Error Loading Page
                </h2>
                <p className="text-gray-400 mb-6">
                  There was an error loading the homepage. Please try refreshing
                  the page.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-violet hover:bg-violet/80 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        }
      >
        <div className="bg-[url('/img/banner.png')] h-[700px] bg-center bg-cover" />

        <section className="py-32 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <h1 className="text-4xl md:text-5xl font-atirose text-violet font-bold leading-tight">
                The House of Wizards is a Forgotten Runes Community DAO.
              </h1>
              <div className="space-y-6">
                <p className="text-gray-300 text-base leading-relaxed">
                  The House of Wizards, comprised of Forgotten Runes token
                  holders, funds community proposals that support art, lore,
                  development, and other creative endeavors.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  Looking for funding as a community member? Start by submitting
                  a proposal to bring your ideas to life. Interested in joining
                  the community? Visit forgotten.market to explore Forgotten
                  Runes collections.
                </p>
              </div>
              <div className="pt-6">
                <button
                  aria-label="Scroll to team section"
                  className="bg-violet text-white px-8 py-3 rounded-full hover:bg-violet-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet focus:ring-opacity-50 font-medium shadow-lg hover:shadow-xl"
                  onClick={() => {
                    document.getElementById("team-section")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Meet the Team
                </button>
              </div>
            </div>
            <div className="relative h-[600px]">
              <div className="absolute inset-0">
                {/* Replace with your actual hero image */}
                <div className="bg-gradient-to-br from-violet/20 to-purple-100/30 rounded-3xl h-full w-full backdrop-blur-sm shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        <div className="bg-neutral-darkGray py-32 px-8" id="team-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <h2 className="text-brand-500 text-5xl md:text-6xl font-atirose mb-10">
                Forgotten Council
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                The Forgotten Council is the group of wizards and warriors
                holding the keys to the DAO multisig wallet, is responsible for
                facilitating governance - everything from running votes for new
                proposals to managing the ministries and carrying out multisig
                transactions.
              </p>
            </div>

            <div className="flex flex-row flex-wrap gap-8 justify-center mt-16">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="w-[200px] sm:w-[220px] transform transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-[3/4] mb-6 overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <NextImage
                      alt={member.name}
                      className="w-full h-full object-cover"
                      height={253}
                      src={member.image}
                      width={190}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-atirose text-center text-violet">
                      {member.name}
                    </h3>
                    {/* <p className="text-gray-600 text-center">{member.role}</p>
                <p className="text-sm text-gray-500 text-center">{member.bio}</p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center py-32 px-8">
          <div className="max-w-6xl w-full mx-auto flex md:flex-row flex-col gap-20 items-center">
            {/* Text Section */}
            <div className="text-white space-y-8 w-full md:w-1/2">
              <div>
                <h2 className="text-5xl md:text-6xl font-atirose leading-tight">
                  Contact <i className="font-atirose text-brand-500">Us</i>
                </h2>
              </div>
              <p className="text-gray-400 text-base leading-relaxed">
                It is very important for us to keep in touch with you, so we are
                always ready to answer any question that interests you. Shoot!
              </p>
            </div>

            {/* Form Section */}
            <div className="w-full md:w-1/2 max-w-lg">
              {submitStatus === "success" && (
                <div className="mb-6 p-6 bg-green-900 border border-green-700 rounded-xl text-green-200 shadow-lg">
                  <p className="font-medium">Message sent successfully!</p>
                  <p className="text-sm mt-1">We'll get back to you soon.</p>
                </div>
              )}

              {submitStatus === "error" && (
                <ErrorMessage
                  className="mb-4"
                  message={errorMessage}
                  onDismiss={() => setSubmitStatus(null)}
                />
              )}

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                  <input
                    required
                    aria-label="Your name"
                    className="w-full bg-transparent border-b-2 border-gray-700 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all duration-300"
                    disabled={isSubmitting}
                    name="name"
                    placeholder="Your Name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <input
                    required
                    aria-label="Your email"
                    className="w-full bg-transparent border-b-2 border-gray-700 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all duration-300"
                    disabled={isSubmitting}
                    name="email"
                    placeholder="Your Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <textarea
                    required
                    aria-label="Your message"
                    className="w-full bg-transparent border-b-2 border-gray-700 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all duration-300 resize-none"
                    disabled={isSubmitting}
                    name="message"
                    placeholder="Share your thoughts"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </div>

                <button
                  aria-label="Send message"
                  className="w-full bg-white text-black py-3 px-6 rounded-full font-medium hover:bg-brand-500 hover:text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-8"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner message="" size="sm" />
                      SENDING...
                    </>
                  ) : (
                    "SEND"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </DefaultLayout>
  );
}
