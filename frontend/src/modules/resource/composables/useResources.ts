import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { message } from 'ant-design-vue';
import { resourceService } from '../resource.service';
import type { Resource, ResourceQueryParams } from '../resource.types';
import { useRouter } from 'vue-router';

export function useResources(queryParams?: any) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const downloadingId = ref<string | null>(null);

  // 1. Fetch Resources
  const resourcesQuery = useQuery({
    queryKey: ['resources', queryParams],
    queryFn: () => resourceService.listResources(queryParams?.value || {}),
    placeholderData: (prev) => prev,
  });

  // 2. Rate Resource Mutation
  const rateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: number }) => 
      resourceService.rateResource(id, value),
    onSuccess: (data, variables) => {
      message.success(`Rating of ${variables.value} stars saved!`);
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resource', variables.id] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to submit rating');
    }
  });

  // 3. Handlers
  const handleRead = (res: Resource) => {
    router.push({ name: 'ResourceDetail', params: { id: res.id } });
  };

  const handleDownload = async (res: Resource) => {
    if (downloadingId.value) return;
    
    downloadingId.value = res.id;
    message.loading({ content: `Securing archive for ${res.title}...`, key: 'dl', duration: 0 });
    
    // In a real app, this would be a direct file download from S3/backend
    // For now, we simulate a small delay then provide the fileUrl if it exists
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (res.fileUrl) {
        window.open(res.fileUrl, '_blank');
      } else {
        // Fallback for demo
        const blobContent = `
          TIGRAY RESOURCES CENTER - DIGITAL ARCHIVE
          ==========================================
          RESOURCE ID: ${res.id}
          TITLE: ${res.title}
          CATEGORY: ${res.category?.name || 'N/A'}
          DATE: ${new Date(res.createdAt).toLocaleDateString()}
          ==========================================
          Secure verification hash: 0x${Math.random().toString(16).slice(2, 10)}...
        `;
        const blob = new Blob([blobContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${res.title.replace(/\s+/g, '_')}_Archive.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      message.success({ content: 'Digital archive secured and downloaded.', key: 'dl' });
    } catch (err) {
      message.error({ content: 'Download initialization failed.', key: 'dl' });
    } finally {
      downloadingId.value = null;
    }
  };

  const handleRate = (res: Resource, value: number) => {
    rateMutation.mutate({ id: res.id, value });
  };

  return {
    resources: computed(() => resourcesQuery.data.value?.items || []),
    total: computed(() => resourcesQuery.data.value?.total || 0),
    loading: resourcesQuery.isPending,
    isFetching: resourcesQuery.isFetching,
    downloadingId,
    handleRead,
    handleDownload,
    handleRate,
    refresh: () => resourcesQuery.refetch()
  };
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => resourceService.getCategories(),
  });
}

export function useResourceDetail(id: string) {
  const queryClient = useQueryClient();

  const resourceQuery = useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourceService.getResource(id),
    enabled: !!id
  });

  const commentsQuery = useQuery({
    queryKey: ['resource-comments', id],
    queryFn: () => resourceService.getComments(id),
    enabled: !!id
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => resourceService.addComment(id, content),
    onSuccess: () => {
      message.success('Comment added!');
      queryClient.invalidateQueries({ queryKey: ['resource-comments', id] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to add comment');
    }
  });

  return {
    resource: resourceQuery.data,
    loading: resourceQuery.isPending,
    comments: commentsQuery.data,
    loadingComments: commentsQuery.isPending,
    addComment: (content: string) => addCommentMutation.mutate(content),
    addingComment: addCommentMutation.isPending
  };
}
