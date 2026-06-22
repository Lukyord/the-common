export const updatePageSaveButtonGlobal = {
  components: {
    elements: {
      SaveButton: {
        path: '@/components/payload/update-page-save-button',
        exportName: 'UpdatePageSaveButton',
      },
    },
  },
} as const

export const updatePageSaveButtonCollection = {
  components: {
    edit: {
      SaveButton: {
        path: '@/components/payload/update-page-save-button',
        exportName: 'UpdatePageSaveButton',
      },
    },
  },
} as const
