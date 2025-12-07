from datetime import datetime, UTC
from app.core.database import SessionLocal
from app.models.news import News

def seed_test_data():
    db = SessionLocal()
    
    try:
        existing_count = db.query(News).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} news items. Skipping seed.")
            return
        
        test_news = [
            News(
                title="GPT-5 Released: Revolutionary AI Breakthrough",
                body="OpenAI announces GPT-5 with unprecedented capabilities in reasoning and multimodal understanding.",
                summary="GPT-5 brings major advances in AI reasoning and multimodal capabilities.",
                source="TechCrunch",
                url="https://example.com/gpt5-release",
                published_at=datetime.now(UTC),
                created_at=datetime.now(UTC),
                from_serper=False,
                priority=1
            ),
            News(
                title="New Machine Learning Framework Achieves SOTA Results",
                body="Researchers unveil a new ML framework that achieves state-of-the-art results across multiple benchmarks.",
                summary="New ML framework sets new performance records across benchmarks.",
                source="ArXiv",
                url="https://example.com/ml-framework",
                published_at=datetime.now(UTC),
                created_at=datetime.now(UTC),
                from_serper=False,
                priority=2
            ),
            News(
                title="AI Safety Research Advances with New Alignment Technique",
                body="Major breakthrough in AI safety as researchers develop novel alignment approach.",
                summary="New alignment technique improves AI safety research significantly.",
                source="Nature",
                url="https://example.com/ai-safety",
                published_at=datetime.now(UTC),
                created_at=datetime.now(UTC),
                from_serper=False,
                priority=1
            ),
            News(
                title="LLM Optimization Reduces Inference Costs by 90%",
                body="New optimization technique dramatically reduces the cost of running large language models.",
                summary="Novel optimization slashes LLM inference costs by 90%.",
                source="MIT Technology Review",
                url="https://example.com/llm-optimization",
                published_at=datetime.now(UTC),
                created_at=datetime.now(UTC),
                from_serper=False,
                priority=2
            ),
            News(
                title="Neural Networks Learn to Self-Improve Without Human Intervention",
                body="Breakthrough research shows neural networks can improve their own architecture autonomously.",
                summary="Neural networks demonstrate autonomous self-improvement capabilities.",
                source="Science Daily",
                url="https://example.com/self-improving-nn",
                published_at=datetime.now(UTC),
                created_at=datetime.now(UTC),
                from_serper=False,
                priority=1
            ),
        ]
        
        for news in test_news:
            db.add(news)
        
        db.commit()
        print(f"Successfully seeded {len(test_news)} test news items")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_test_data()

