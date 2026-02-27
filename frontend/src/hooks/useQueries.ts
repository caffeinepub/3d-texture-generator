import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type TexturePreset, type UserProfile, type GenerationParameters, MaterialType } from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Presets ─────────────────────────────────────────────────────────────────

export function useGetAllPresets() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TexturePreset[]>({
    queryKey: ['presets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPresets();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPresetsByMaterial(materialType: MaterialType | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TexturePreset[]>({
    queryKey: ['presets', 'byMaterial', materialType],
    queryFn: async () => {
      if (!actor || !materialType) return [];
      return actor.getPresetsByMaterialType(materialType);
    },
    enabled: !!actor && !actorFetching && !!materialType,
  });
}

export function useSavePreset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      materialType,
      parameters,
    }: {
      name: string;
      materialType: MaterialType;
      parameters: GenerationParameters;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.savePreset(name, materialType, parameters);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
    },
  });
}

export function useDeletePreset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePreset(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
    },
  });
}
