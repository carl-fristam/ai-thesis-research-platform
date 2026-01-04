# Recommended Taxonomy for a Bank-Partnered AML Thesis

Based on your sources and the nature of working with real banking data, here's a recommended structure:

## Overall Structure Recommendation

Given that you have **real transaction monitoring data** from a bank partner, I recommend a **methodology-focused, empirical research structure** rather than a purely theoretical or survey paper. Here's why:

### Your Unique Position

[Powerful Graph Neural Networks for Money Laundering Pattern Detection](https://studenttheses.uu.nl/bitstream/handle/20.500.12932/50600/thesis_Stan.pdf?sequence=1&isAllowed=y) by Verlaan (2024) provides an excellent example of thesis structure. His work "extends the work of Egressy et al. (2024)" and proposes "a set of techniques that enable GNNs to detect suspicious subgraph patterns in the weighted temporal networks underlying financial data."

## Recommended Taxonomy/Structure

### 1. **Introduction & Problem Statement** (15-20%)
- **Context**: Current AML challenges in transaction monitoring
- **Problem**: Why existing systems fail (as noted in [White Paper: Knowledge Graphs for Anti-Money Laundering](https://ficonsulting.com/insight-post/knowledge-graphs-for-anti-money-laundering-and-transaction-monitoring/): "Rules based approaches do not scale well and produce high false positive rates")
- **Research Questions**: Specific to your dataset and bank partner's needs
- **Contribution**: What you're adding to existing research

### 2. **Literature Review & Theoretical Background** (20-25%)

#### 2.1 Anti-Money Laundering Domain
- Regulatory landscape
- Current detection methods
- Industry pain points

#### 2.2 Graph-Based Approaches
Organize by methodology evolution:

**a) Knowledge Graphs for AML**
- [White Paper: Knowledge Graphs for AML](https://ficonsulting.com/insight-post/knowledge-graphs-for-anti-money-laundering-and-transaction-monitoring/) emphasizes how knowledge graphs address "complex, high-dimensional, non-linear patterns"
- [Recommendations on Implementing an Investigation Knowledge Graph](https://trace-illicit-money-flows.eu/recommendations-on-implementing-an-investigation-knowledge-graph-to-combat-illicit-money-flows/) provides implementation guidance

**b) Traditional Machine Learning**
- [Anti-Money Laundering Alert Optimization Using Machine Learning](https://arxiv.org/abs/2112.07508)
- Baseline approaches for comparison

**c) Standard GNN Approaches**
- [Self-Supervised Graph Representation Learning for Anti Money Laundering](https://arxiv.org/abs/2210.14360)
- Message-passing frameworks

**d) Heterogeneous GNN Approaches**
- [Finding Money Launderers Using Heterogeneous Graph Neural Networks](https://arxiv.org/abs/2307.13499)
- [Heterogeneous Graph Auto-Encoder for CreditCard Fraud](https://arxiv.org/abs/2410.08121)
- Why heterogeneous modeling matters for financial networks

**e) Hybrid and Advanced Approaches**
- [Detecting and Preventing Money Laundering Using Deep Learning and Graph Analysis](https://thesai.org/Downloads/Volume16No6/Paper_1-Detecting_and_Preventing_Money_Laundering.pdf) shows LSTM-GraphSAGE hybrid achieving 95.4% accuracy
- [Research on anti-money laundering technology based on graph attention](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13511/135111T/Research-on-anti-money-laundering-technology-based-on-graph-attention/10.1117/12.3056070.full)

#### 2.3 Production and Practical Considerations
- [Explainable Artificial Intelligence for Anti-Money Laundering](https://www.sas.com/en/whitepapers/explainable-artificial-intelligence-for-anti-money-laundering.html) - XAI requirements
- [Privacy-Aware Graph Embeddings](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5320964) - Privacy constraints
- [AI-Powered Fraud Detection in Financial Services](https://papers.ssrn.com/sol3/Delivery.cfm/5170054.pdf?abstractid=5170054) - Scalability and real-time feasibility

### 3. **Dataset & Problem Formulation** (10-15%)

**Critical for working with real bank data:**

#### 3.1 Data Description
- Transaction monitoring dataset characteristics
- Graph construction methodology (how transactions become graphs)
- Privacy considerations and data anonymization
- Temporal aspects (as emphasized in [Advances in Continual Graph Learning for Anti-Money Laundering](https://arxiv.org/abs/2503.24259))

#### 3.2 Ground Truth & Labels
- How suspicious activity is labeled (SAR-based? Expert-reviewed?)
- Class imbalance considerations
- Training/validation/test splits

#### 3.3 Graph Modeling Decisions
- Homogeneous vs. heterogeneous graph representation
- Node types (accounts, entities, etc.)
- Edge types (transaction types)
- Feature engineering choices

### 4. **Methodology** (20-25%)

#### 4.1 Model Architecture
**Choose your approach based on data characteristics:**

**Option A: If you have multiple entity/transaction types:**
- Heterogeneous GNN architecture (following [Finding Money Launderers Using Heterogeneous Graph Neural Networks](https://arxiv.org/abs/2307.13499))

**Option B: If temporal patterns are critical:**
- Hybrid approach like [Detecting and Preventing Money Laundering Using Deep Learning](https://thesai.org/Downloads/Volume16No6/Paper_1-Detecting_and_Preventing_Money_Laundering.pdf) with LSTM-GraphSAGE

**Option C: If continual learning is needed:**
- [Advances in Continual Graph Learning for Anti-Money Laundering](https://arxiv.org/abs/2503.24259) approach

#### 4.2 Training Procedure
- Loss functions
- Optimization strategy
- Hyperparameter tuning
- Handling class imbalance

#### 4.3 Baseline Comparisons
Following [AI-Powered Fraud Detection in Financial Services](https://papers.ssrn.com/sol3/Delivery.cfm/5170054.pdf?abstractid=5170054):
- Traditional ML (Random Forest, XGBoost)
- Rule-based systems currently in use
- Standard GNN architectures

#### 4.4 Explainability Components
As emphasized by [Explainable AI for AML](https://www.sas.com/en/whitepapers/explainable-artificial-intelligence-for-anti-money-laundering.html):
- Which XAI techniques you're using
- How explanations will be generated for compliance officers

### 5. **Experiments & Results** (15-20%)

#### 5.1 Experimental Setup
- Computational environment
- Evaluation metrics (following [Anti-Money Laundering by Group-Aware Deep Graph Learning](https://www.ijraset.com/research-paper/anti-money-laundering-by-group-aware-deep-graph-learning))

#### 5.2 Performance Analysis
**Key metrics for AML (not just accuracy):**
- **False Positive Rate** (critical for banks - mentioned in FI Consulting white paper)
- **True Positive Rate / Recall** (catching actual money laundering)
- **Precision** (reducing analyst workload)
- **F1-Score**
- **AUC-ROC**

#### 5.3 Comparative Analysis
- Your approach vs. baselines
- Ablation studies (what components matter most?)
- Sensitivity analysis (as in [Enhancing AML Systems Using Knowledge Graphs and GNNs](https://www.researchgate.net/publication/387449610_Enhancing_Anti-Money_Laundering_Systems_Using_Knowledge_Graphs_and_Graph_Neural_Networks): "features such as transaction timestamps and payment formats")

#### 5.4 Case Studies
- Examples of detected patterns
- Visualizations of suspicious subgraphs
- Explanation quality examples

### 6. **Discussion** (10-15%)

#### 6.1 Findings Interpretation
- What patterns does your model detect?
- How does it improve over current systems?
- Generalization considerations (address the overf
