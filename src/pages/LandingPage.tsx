import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Code, Palette, Layers, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: <Sparkles size={20} />,
    title: 'Chat-Driven Design',
    description:
      'Describe your banner in plain English and watch it come to life in real time.',
  },
  {
    icon: <Palette size={20} />,
    title: 'Full Customization',
    description:
      'Fine-tune colors, typography, layout, and content with a visual editor.',
  },
  {
    icon: <Layers size={20} />,
    title: 'Two-Layer Support',
    description:
      'First layer overview and second layer with per-service toggles, following GDPR best practices.',
  },
  {
    icon: <Shield size={20} />,
    title: 'Usercentrics Powered',
    description:
      'Built on the Usercentrics Browser SDK for full compliance with GDPR, CCPA, and TCF 2.0.',
  },
  {
    icon: <Code size={20} />,
    title: 'Export Code',
    description:
      'Generate production-ready Vanilla JS or React code for your custom banner.',
  },
  {
    icon: <Zap size={20} />,
    title: 'Live Preview',
    description:
      'See every change instantly with desktop and mobile preview modes.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield size={16} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">UC Banner Builder</span>
          </div>
          <Button onClick={() => navigate('/builder')} size="sm">
            Open Builder
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles size={14} />
            Powered by Usercentrics SDK
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Build Custom CMP Banners
            <br />
            <span className="text-primary">with Natural Language</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Design GDPR-compliant consent banners by chatting. Customize every
            detail, preview in real-time, and export production-ready code
            powered by the Usercentrics Browser SDK.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => navigate('/builder')} size="lg">
              Start Building
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .getElementById('features')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Banner demo preview */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-1 shadow-2xl">
            <div className="rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex items-center justify-center min-h-[320px] relative overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.04) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
              {/* Mini banner preview */}
              <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden border border-gray-100">
                <div className="p-5 pb-3">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Shield size={14} className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">
                      We value your privacy
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    We use cookies and similar technologies to provide the best
                    experience on our website.
                  </p>
                </div>
                <div className="px-5 pb-2">
                  <div className="flex gap-1.5">
                    {['Essential', 'Analytics', 'Marketing'].map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 rounded-full text-[10px] bg-gray-100 text-gray-600"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-5 pt-3 space-y-1.5">
                  <div className="w-full h-8 bg-blue-500 rounded-lg" />
                  <div className="flex gap-1.5">
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg" />
                    <div className="flex-1 h-8 border border-blue-500 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need for custom consent banners
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A complete toolkit for building, customizing, and exporting
              GDPR-compliant consent management banners.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
          <p className="text-muted-foreground mb-8">
            Start designing your custom consent banner in seconds. No account
            required.
          </p>
          <Button onClick={() => navigate('/builder')} size="lg">
            Open the Builder
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield size={14} />
            <span>UC Banner Builder</span>
          </div>
          <span>
            Built with Usercentrics Browser SDK
          </span>
        </div>
      </footer>
    </div>
  );
}
