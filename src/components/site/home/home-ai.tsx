import type { CSSProperties } from "react";
import { SmartLink } from "@/components/site/smart-link";
import { SolveChat } from "./home-solve-chat";
import "@/styles/home-ai.css";

// THE AI DEVELOPMENT SECTION OF THE HOME PAGE (owner, 2026-11-12: what We3vision gives in AI development, and what the customer gets). Every sentence is from the
// AI Development page (lib/cms/content/ai.ts); no numbers except the two project times that page states itself (2-3 weeks for simple bots, 1-3 months for complex
// models). Left: what it is. Right: a small picture of the idea (your data -> We3vision AI -> the work done), drawn in CSS. Under it: the four kinds of AI work with
// what the customer gets from each, and three problems AI takes off your plate. Styles: styles/home-ai.css ("hba-").

const FROM = ["Website and apps", "Emails and chats", "CRM and sales", "Documents"];
const DOES = ["Answer customers", "Qualify leads", "Write reports", "Predict demand"];

const WORK = [
  {
    t: "Generative AI and AI agents",
    x: "Chatbots and AI assistants connected to your own data, tools and systems, built on models such as OpenAI.",
    g: ["A chatbot or assistant that knows your business", "Agents connected to your CRM, e-mail and documents", "Hard cases passed to your team with the full story"],
  },
  {
    t: "Machine learning",
    x: "Recommendation engines, customer behaviour prediction and other models trained on your business data.",
    g: ["Recommendations that fit each customer", "Predictions of demand and behaviour", "A model trained on your own data, not a generic one"],
  },
  {
    t: "Computer vision",
    x: "Image recognition for use cases like medical image analysis or property listings.",
    g: ["Images read and sorted automatically", "Important items flagged for a person to check", "Works with scans, photos or video from your own systems"],
  },
  {
    t: "MLOps and RAG",
    x: "Deployment, monitoring and retraining of models in production, plus answers grounded in your own documents.",
    g: ["Deployment, monitoring and retraining in production", "Answers grounded in your own documents", "Alerts before small problems become big ones"],
  },
];

const SOLVE = [
  { q: "Customers wait for answers", a: "AI chatbots answer common questions instantly, at any hour, and pass the rest to your team." },
  { q: "Leads are not sorted", a: "Lead qualification bots score and route enquiries, so your team talks to the right people first." },
  { q: "Too much manual data work", a: "AI automates data-heavy tasks such as entering, sorting and checking information." },
];

export function HomeAi() {
  return (
    <section className="hba" id="ai-development" aria-labelledby="hba-title">
      <div className="hb2-wrap">
        <p className="hb2-label">AI development</p>
        <div className="hba-top">
          <div className="hba-copy" data-r>
            <h2 id="hba-title">
              Custom AI that does <em>real work</em> for your business
            </h2>
            <p className="hba-lede">
              We build custom AI tools and integrations: chatbots, recommendation systems, AI search, computer vision and predictive models, built from scratch around your goals and the tools you already use.
            </p>
            <p className="hba-note">Simple bots can be ready in 2–3 weeks. Complex models take 1–3 months.</p>
            <div className="hba-cta">
              <SmartLink href="/contact" className="hb2-m-btn">
                Get a free quote
              </SmartLink>
              <SmartLink href="/ai" className="hba-more">
                See AI development <span aria-hidden>&rarr;</span>
              </SmartLink>
            </div>
          </div>

          {/* the idea in one picture: your data, the AI, the work done */}
          <div className="hba-flow" aria-hidden data-r style={{ "--d": "120ms" } as CSSProperties}>
            <ul className="hba-col">
              <li className="hba-k">Your data</li>
              {FROM.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="hba-core">
              <span className="hba-ring" />
              <b>We3vision AI</b>
            </div>
            <ul className="hba-col hba-out">
              <li className="hba-k">What it does</li>
              {DOES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="hba-h3" data-r>
          What we build, and what you get
        </h3>
        <ul className="hba-work">
          {WORK.map((w, i) => (
            <li key={w.t} data-r style={{ "--d": `${i * 80}ms` } as CSSProperties}>
              <span className="hba-no">{String(i + 1).padStart(2, "0")}</span>
              <h4>{w.t}</h4>
              <p>{w.x}</p>
              <p className="hba-gl">You get</p>
              <ul>
                {w.g.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <h3 className="hba-h3" data-r>
          Problems AI can take off your plate
        </h3>
        {/* phone: the same problems as a small chat (the list below is hidden there) */}
        <SolveChat items={SOLVE} tag="With AI" kind="ai" />
        <ul className="hba-solve">
          {SOLVE.map((s, i) => (
            <li key={s.q} data-r style={{ "--d": `${i * 90}ms` } as CSSProperties}>
              <p className="hba-q">{s.q}</p>
              <p className="hba-a">{s.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
