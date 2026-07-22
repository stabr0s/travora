"use server";

import { revalidatePath } from "next/cache";

import {
  createPlace,
  deletePlace,
  updatePlace,
  updatePlaceStatus,
} from "@/features/places/services/places-service";
import type {
  CreatePlaceActionState,
  PlaceFormFields,
} from "@/features/places/types/persisted-place";
import type { PlaceCategory, PlacePriority, PlaceStatus } from "@/features/places/types/place";
import { isUuid } from "@/lib/validation/is-uuid";

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function readPlaceFields(formData: FormData): PlaceFormFields {
  return {
    title: readField(formData, "title"),
    category: readField(formData, "category"),
    address: readField(formData, "address"),
    city: readField(formData, "city"),
    country: readField(formData, "country"),
    status: readField(formData, "status"),
    priority: readField(formData, "priority"),
    notes: readField(formData, "notes"),
    websiteUrl: readField(formData, "websiteUrl"),
    latitude: readField(formData, "latitude"),
    longitude: readField(formData, "longitude"),
    mapOrder: readField(formData, "mapOrder"),
  };
}

type ParsedMapFields =
  | { data: { latitude: number | null; longitude: number | null; mapOrder: number | null }; error: null }
  | { data: null; error: string };

function parseOptionalNumber(value: string): number | null {
  return value === "" ? null : Number(value);
}

function readMapFields(formData: FormData): ParsedMapFields {
  const latitude = parseOptionalNumber(readField(formData, "latitude"));
  const longitude = parseOptionalNumber(readField(formData, "longitude"));
  const mapOrder = parseOptionalNumber(readField(formData, "mapOrder"));

  if (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) {
    return { data: null, error: "Latitude must be a number between -90 and 90." };
  }
  if (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) {
    return { data: null, error: "Longitude must be a number between -180 and 180." };
  }
  if (mapOrder !== null && (!Number.isInteger(mapOrder) || mapOrder < 0)) {
    return { data: null, error: "Map order must be a whole number of 0 or more." };
  }

  return { data: { latitude, longitude, mapOrder }, error: null };
}

export async function createPlaceAction(
  _previousState: CreatePlaceActionState,
  formData: FormData,
): Promise<CreatePlaceActionState> {
  const tripId = readField(formData, "tripId");
  const fields = readPlaceFields(formData);
  const title = fields.title;

  if (!isUuid(tripId)) {
    return { status: "error", message: "This saved trip is not available.", fields };
  }

  if (!title) {
    return { status: "error", message: "Enter a name for this place.", fields };
  }

  const mapFields = readMapFields(formData);
  if (mapFields.error) return { status: "error", message: mapFields.error, fields };

  const result = await createPlace({
    tripId,
    title,
    category: fields.category as PlaceCategory,
    address: fields.address,
    city: fields.city,
    country: fields.country,
    status: fields.status as PlaceStatus,
    priority: fields.priority as PlacePriority,
    notes: fields.notes,
    websiteUrl: fields.websiteUrl,
    ...mapFields.data,
  });

  if (result.error) {
    return { status: "error", message: result.error.message, fields };
  }

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Place saved to this trip." };
}

export async function updatePlaceAction(
  _previousState: CreatePlaceActionState,
  formData: FormData,
): Promise<CreatePlaceActionState> {
  const tripId = readField(formData, "tripId");
  const id = readField(formData, "recordId");
  const fields = readPlaceFields(formData);
  const title = fields.title;

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available.", fields };
  if (!isUuid(id)) return { status: "error", message: "This place is not available.", fields };
  if (!title) return { status: "error", message: "Enter a name for this place.", fields };

  const mapFields = readMapFields(formData);
  if (mapFields.error) return { status: "error", message: mapFields.error, fields };

  const result = await updatePlace({
    id,
    tripId,
    title,
    category: fields.category as PlaceCategory,
    address: fields.address,
    city: fields.city,
    country: fields.country,
    status: fields.status as PlaceStatus,
    priority: fields.priority as PlacePriority,
    notes: fields.notes,
    websiteUrl: fields.websiteUrl,
    ...mapFields.data,
  });

  if (result.error) return { status: "error", message: result.error.message, fields };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Place updated." };
}

export async function deletePlaceAction(
  tripId: string,
  id: string,
): Promise<CreatePlaceActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This place is not available." };

  const result = await deletePlace({ tripId, id });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Place deleted." };
}

export async function updatePlaceStatusAction(
  tripId: string,
  id: string,
  status: PlaceStatus,
): Promise<CreatePlaceActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(id)) return { status: "error", message: "This place is not available." };

  const result = await updatePlaceStatus({ tripId, id, status });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Place status updated." };
}
