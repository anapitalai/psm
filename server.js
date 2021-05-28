// Requirements
const mongoose = require("mongoose");
const express = require("express");
const AdminBro = require("admin-bro");
const AdminBroExpressjs = require("@admin-bro/express");
const bcrypt = require("bcryptjs");
const argon2 = require("argon2");
const User = require("./models/User.model");
const PSMSketch = require("./models/PSMSketch.model");
const PSM = require("./models/Psm.model");
const Donor = require("./models/Donor.model");
const Brand = require("./models/Brand.model");
const Supplier = require("./models/Supplier.model");
const Staff = require("./models/Staff.model");
const CATSketch = require("./models/CATSketch.model");
const Category = require("./models/Category.model");
const Borrow = require("./models/Borrow.model");
const Registry = require("./models/Registry.model");
const bodyParser = require("body-parser");
const utm2ll = require("./hooks/utm2geo");

require("dotenv").config();

const adminNavigation = {
  name: "Admin",
  icon: "Restriction",
};
const restrictedNavigation = {
  name: "Restricted",
  icon: "Accessibility",
};

////just added for image upload
const {
  after: uploadAfterHook,
  before: uploadBeforeHook,
} = require("./hooks/upload-image.hook");

//just added for image upload
const {
  after: passwordAfterHook,
  before: passwordBeforeHook,
} = require("./hooks/password.hook");

// We have to tell AdminBro that we will manage mongoose resources with it
AdminBro.registerAdapter(require("@admin-bro/mongoose"));

// express server definition
const app = express();
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

// RBAC functions
const canEditRecords = ({ currentAdmin, record }) => {
  return (
    currentAdmin &&
    (currentAdmin.role === "admin" ||
      currentAdmin._id === record.param("ownerId"))
  );
};
const canModifyUsers = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === "admin";
//
// Pass all configuration settings to AdminBro
const adminBro = new AdminBro({
  assets: {
    styles: [
      "https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.1.1/css/ol.css",
      "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css",
      "https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css",
    ],
    scripts: [
      "https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.1.1/build/ol.js",
      //"https://maps.googleapis.com/maps/api/js?key="+process.env.GOOGLE_API_KEY,
      "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js",
      "https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js",
    ],
  },

  branding: {
    companyName: "PNG SURVEY PSMs",
    logo: "",
  },
  theme: {
    color: {
      primary: "red",
      bck: "maroon",
    },
  },
  resources: [
    {
      
      resource: PSM,
      options: {
        navigation: restrictedNavigation,
        properties: {
          ownerId: {
              // type: mongoose.Types.ObjectId,
              // ref: 'User',
            isVisible: { edit: false, show: true, list: true, filter: true },
          },
          id: {
            isVisible: { edit: false, show: true, list: true, filter: false },
          },
          createdAt: {
            isVisible: { edit: false, show: false, list: false, filter: true },
          },
          lat: {
            isVisible: { edit: true, show: false, list: false, filter: false },
          },
          lon: {
            isVisible: { edit: true, show: false, list: false, filter: false },
          },
          northings: {
            type: Number,
            isVisible: { edit: true, show: true, list: true, filter: true },
          },
          eastings: {
            type: Number,
            isVisible: { edit: true, show: true, list: true, filter: true },
          },
          mean_sea_level: {
            type: Number,
            isVisible: { edit: true, show: true, list: true, filter: false },
          },
          ellipsoidal_height_error: {
            type: Number,
            isVisible: { edit: true, show: true, list: true, filter: false },
          },
          n_value: {
            type: Number,
            isVisible: { edit: true, show: true, list: true, filter: false },
          },

          //description: { type: "richtext" },
          //map starts heres
          map: {
            components: {
              show: AdminBro.bundle("./components/map.show.jsx"),
            },
            isVisible: {
              show: true,
              edit: true,
              filter: false,
              list: false,
            },
          },
          //map ends here

          updatedAt: {
            isVisible: { edit: true, show: false, list: false, filter: false },
          },
        },
        actions: {
          edit: {
            isAccessible: canEditRecords,
            //here
            before: async (request) => {
              if (request.method == "post") {
                const { eastings, northings, ...otherParams } = request.payload;
                if (eastings && northings) {
                  const latlon = utm2ll.UTM2LL(eastings, northings, 55, false);
                  const lat = latlon[0];
                  const lon = latlon[1];
                  return {
                    ...request,
                    payload: {
                      ...otherParams,
                      lat,
                      lon,
                    },
                  };
                }
              }

              return request;
            },
          },
          delete: { isAccessible: canEditRecords },

          //start here
          new: {
            isAccessible: ({ currentAdmin }) =>
            currentAdmin && currentAdmin.role === "admin",
            before: async (request) => {
              if (request.method == "post") {
                const { eastings, northings, ...otherParams } = request.payload;
                if (eastings && northings) {
                  const latlon = utm2ll.UTM2LL(eastings, northings, 55, false);
                  const lat = latlon[0];
                  const lon = latlon[1];
                  return {
                    ...request,
                    payload: {
                      ...otherParams,
                      lat,
                      lon,
                    },
                  };
                }
              }

              return request;
            },
          },

          // new: {
          //   before: async (request, { currentAdmin }) => {
          //     request.payload = {
          //       ...request.payload,
          //       ownerId: currentAdmin._id,
          //     };
          //     return request;
          //   },
          // },
        },
      },
    },

    //Users
    {
      resource: User,
      options: {
        navigation: adminNavigation,
        properties: {
          encryptedPassword: { isVisible: false },
          profilePhotoLocation: { isVisible: false },
          password: {
            type: "string",
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
          uploadImage: {
            components: {
              edit: AdminBro.bundle("./components/upload-image.edit.tsx"),
              list: AdminBro.bundle("./components/upload-image.list.tsx"),
            },
          },
        },
        actions: {
          // new: {
          //   before: async (request) => {
          //     if (request.payload.password) {
          //       request.payload = {
          //         ...request.payload,
          //         encryptedPassword: await bcrypt.hash(
          //           request.payload.password,
          //           10
          //         ),
          //         password: undefined,
          //       };
          //     }
          //     return request;
          //   },
          // },

          //to cater for image upload
          new: {
            after: async (response, request, context) => {
              const modifiedResponse = await passwordAfterHook(
                response,
                request,
                context
              );
              return uploadAfterHook(modifiedResponse, request, context);
            },
            before: async (request, context) => {
              const modifiedRequest = await passwordBeforeHook(
                request,
                context
              );
              return uploadBeforeHook(modifiedRequest, context);
            },
            isAccessible: ({ currentAdmin }) =>
              currentAdmin && currentAdmin.role === "admin",
          },
          edit: {
            isAccessible: canModifyUsers,
            after: async (response, request, context) => {
              const modifiedResponse = await passwordAfterHook(
                response,
                request,
                context
              );
              return uploadAfterHook(modifiedResponse, request, context);
            },
            before: async (request, context) => {
              const modifiedRequest = await passwordBeforeHook(
                request,
                context
              );
              return uploadBeforeHook(modifiedRequest, context);
            },
          },   
          delete: { isAccessible: canModifyUsers },      
          bulkDelete: { isAccessible: canModifyUsers },
        },
      },
    },
    //Sketches
    {
      resource: PSMSketch,
      options: {
        navigation: adminNavigation,
        properties: {
          sketch: {
            isVisible: true,
            components: {
              edit: AdminBro.bundle("./components/sketch.edit.tsx"),
            },
          },
          createdAt: { isVisible: false },
          updatedAt: { isVisible: false },
          name: { isVisible: true },
          ownerId: {
            isVisible: { edit: false, show: true, list: true, filter: true },
          },
        },
         actions:{
           new:{
            isAccessible: ({ currentAdmin }) =>
            currentAdmin && currentAdmin.role === "admin"
           }
         }
      },
    },
  ],
  rootPath: "/admin",
});

// Build and use a router which will handle all AdminBro routes buildAuthenticatedRouter
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email });
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword);
      if (matched) {
        return user;
      }
    }
    return false;
  },

  cookiePassword: "some-secret-password-used-to-secure-cookie",
});


app.use(adminBro.options.rootPath, router);
app.use(bodyParser.urlencoded({ extended: false }));

//Running the server
const run = async () => {
  // await mongoose.connect(
  //   "mongodb://" + process.env.DB_HOST_LOCAL + "/" + process.env.DB_LOCAL,
  //   {
  //     useNewUrlParser: true,
  //   }
  // );
  await mongoose.connect(
    "mongodb://" +
      process.env.DB_USER +
      ":" +
      process.env.DB_PASS +
      "@" +
      process.env.DB_HOST +
      "/" +
      process.env.DB_LOCAL,
    {
      useNewUrlParser: true,
    }
  );

  await app.listen(3000, () =>
    console.log(`Example app listening on port 3000!`)
  );
};

run();
