import { Schema, model, models } from "mongoose";

const BusinessSchema = new Schema({
  ndis_registered: {
    type: Boolean,
    default: false,
  },
  abnVerified: {
    type: Boolean,
    default: false,
  },
  discourseId: {
    type: Number,
  },
  Abn: {
    type: String,
    unique: [true, "Already business registered with this Abn number!"],
    // required: [true, "The abn number is required!"],
  },
  AbnStatus: {
    type: String,
  },
  AbnStatusEffectiveFrom: {
    type: String,
  },
  Acn: {
    type: String,
  },
  AddressDate: {
    type: String,
  },
  AddressPostcode: {
    type: String,
  },
  AddressState: {
    type: String,
  },
  BusinessName: [
    {
      type: String,
    },
  ],
  EntityName: {
    type: String,
  },
  EntityTypeCode: {
    type: String,
  },
  EntityTypeName: {
    type: String,
  },
  Gst: {
    type: String,
  },
  location: [
    {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contact: {
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    phone: {
      type: String,
    },
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
  },
  serviceLocations: [
    {
      state: {
        type: String,
      },
      suburbs: {
        type: [String],
      },
    },
  ],
  deliveryOptions: {
    type: [String],
  },
  agesSupported: {
    type: [String],
  },
  about: {
    type: String,
    default: "",
  },
  services: {
    type: [String],
  },
  complexNeedsSupported: {
    type: [String],
  },
  languages: {
    type: [String],
  },
  genderOfAttendants: {
    type: [String],
  },
  rank: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  image: {
    banner: {
      type: String,
    },
    card: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  blurb: {
    type: String,
  },
});

// BusinessSchema.index({ location: "2dsphere" });

// BusinessSchema.index({ "locations.coordinates": "2dsphere" });

const Business = models.Business || model("Business", BusinessSchema);

export default Business;
