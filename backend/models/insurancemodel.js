import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema({
  policyNumber: String,
  customerName: String,
  insuranceType: String,
  text: String,
  embedding: [Number],
});

export default mongoose.model("InsuranceEmbedding", insuranceSchema);
