import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat64 "mo:core/Nat64";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type required by the frontend
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Texture preset types
  public type MaterialType = {
    #metal;
    #wood;
    #fabric;
    #stone;
    #plastic;
    #organic;
  };

  public type GenerationParameters = {
    roughness : Float;
    metalness : Float;
    colorPalette : [Text];
    patternStyle : Text;
    tilingScale : Float;
  };

  public type TexturePreset = {
    name : Text;
    materialType : MaterialType;
    parameters : GenerationParameters;
    timestamp : Int;
    owner : Principal;
  };

  module TexturePreset {
    public func compareByTimestamp(a : TexturePreset, b : TexturePreset) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };

    public func compareByName(a : TexturePreset, b : TexturePreset) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  let presets = Map.empty<Principal, Map.Map<Text, TexturePreset>>();

  public shared ({ caller }) func savePreset(name : Text, materialType : MaterialType, parameters : GenerationParameters) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save presets");
    };

    let newPreset : TexturePreset = {
      name;
      materialType;
      parameters;
      timestamp = Time.now();
      owner = caller;
    };

    let userPresets = switch (presets.get(caller)) {
      case (null) {
        let newMap = Map.empty<Text, TexturePreset>();
        newMap.add(name, newPreset);
        newMap;
      };
      case (?existingMap) {
        existingMap.add(name, newPreset);
        existingMap;
      };
    };

    presets.add(caller, userPresets);
  };

  public query ({ caller }) func getPreset(name : Text) : async ?TexturePreset {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access presets");
    };

    switch (presets.get(caller)) {
      case (null) { null };
      case (?userPresets) { userPresets.get(name) };
    };
  };

  public shared ({ caller }) func deletePreset(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete presets");
    };

    switch (presets.get(caller)) {
      case (null) { () };
      case (?userPresets) {
        userPresets.remove(name);
      };
    };
  };

  public query ({ caller }) func getAllPresets() : async [TexturePreset] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access presets");
    };

    switch (presets.get(caller)) {
      case (null) { [] };
      case (?userPresets) {
        userPresets.values().toArray().sort(TexturePreset.compareByTimestamp);
      };
    };
  };

  public query ({ caller }) func getPresetsByMaterialType(materialType : MaterialType) : async [TexturePreset] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access presets");
    };

    switch (presets.get(caller)) {
      case (null) { [] };
      case (?userPresets) {
        let filtered = userPresets.values().toArray().filter(
          func(preset : TexturePreset) : Bool {
            preset.materialType == materialType;
          }
        );
        filtered.sort(TexturePreset.compareByTimestamp);
      };
    };
  };

  public query ({ caller }) func getAllPresetsByName() : async [TexturePreset] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access presets");
    };

    switch (presets.get(caller)) {
      case (null) { [] };
      case (?userPresets) {
        userPresets.values().toArray().sort(TexturePreset.compareByName);
      };
    };
  };
};
