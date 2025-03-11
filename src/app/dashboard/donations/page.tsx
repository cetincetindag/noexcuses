"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { HeartHandshake, Check, Star, Sparkles, Crown } from "lucide-react";
import { cn } from "~/lib/utils";

// Define the support tier type
type SupportTier = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  badge: string;
  color: string;
  icon: React.ReactNode;
  popular?: boolean;
};

export default function DonationsPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Support tiers
  const tiers: SupportTier[] = [
    {
      id: "supporter",
      name: "Supporter",
      price: 5,
      description: "Show your support for noexcuses",
      features: ["Supporter badge on your profile", "Our eternal gratitude"],
      badge: "Supporter",
      color: "#3498DB",
      icon: <HeartHandshake className="h-5 w-5" />,
    },
    {
      id: "enthusiast",
      name: "Enthusiast",
      price: 10,
      description: "For those who love noexcuses",
      features: ["Enthusiast badge on your profile", "Our eternal gratitude"],
      badge: "Enthusiast",
      color: "#9B59B6",
      icon: <Star className="h-5 w-5" />,
      popular: true,
    },
    {
      id: "champion",
      name: "Champion",
      price: 25,
      description: "Be a champion of productivity",
      features: [
        "Champion badge on your profile",
        "Our eternal gratitude",
        "Vote on feature priorities",
      ],
      badge: "Champion",
      color: "#F39C12",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      id: "legend",
      name: "Legend",
      price: 50,
      description: "Become a legend forever",
      features: [
        "Legend badge on your profile",
        "Our eternal gratitude",
        "All previous tier benefits",
        "Early access to beta features",
      ],
      badge: "Legend",
      color: "#E74C3C",
      icon: <Crown className="h-5 w-5" />,
    },
  ];

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId);
    setTimeout(() => {
      window.open("https://github.com/sponsors/cetincetindag", "_blank");
    }, 500);
  };

  return (
    <div className="container max-w-6xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Support noexcuses</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          noexcuses is, and will be free to use forever. However, running a
          server for your precious data as a couple is a bit costly. Every
          amount of help is greatly appreciated, but not at all expected, or
          required.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={cn(
              "flex flex-col overflow-hidden transition-all hover:shadow-md",
              tier.popular && "border-primary shadow-sm",
            )}
          >
            {tier.popular && (
              <div className="bg-primary text-primary-foreground py-1 text-center text-xs font-medium">
                MOST POPULAR
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: tier.color, color: "white" }}
                >
                  {tier.icon}
                </div>
                <div>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>${tier.price}/month</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">{tier.description}</p>
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSelectTier(tier.id)}
                variant={tier.popular ? "default" : "outline"}
              >
                Choose {tier.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-muted mt-12 rounded-lg p-6">
        <h2 className="mb-4 text-xl font-bold">What Your Support Enables</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-medium">Server Costs</h3>
            <p className="text-muted-foreground text-sm">
              Your support helps cover the costs of servers, databases, and
              infrastructure that keep noexcuses running smoothly.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">New Features</h3>
            <p className="text-muted-foreground text-sm">
              Contributions fund the development of new features, improvements,
              and integrations to make noexcuses even better.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Independent Development</h3>
            <p className="text-muted-foreground text-sm">
              Your support allows noexcuses to remain independent, ad-free, and
              focused on user experience rather than monetization.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground text-sm">
          Have questions about supporting noexcuses? Contact us at{" "}
          <a
            href="mailto:support@noexcuses.app"
            className="text-primary underline"
          >
            support@noexcuses.app
          </a>
        </p>
      </div>
    </div>
  );
}
