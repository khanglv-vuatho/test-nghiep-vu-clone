import ImageFallback from '@/components/ImageFallback'
import { translate } from '@/context/translationProvider'
import { JobType } from '@/types'
import { Chip, CircularProgress } from '@nextui-org/react'
import React, { memo, useCallback, useMemo } from 'react'

type SearchResultType = {
  dataJob: JobType[]
  handleSelectItem: (item: JobType) => void
  onSearching: boolean
}

const SearchResult: React.FC<SearchResultType> = ({ dataJob, handleSelectItem, onSearching }) => {
  const s = translate('Home.Step1')

  const queryParams = useMemo(() => new URLSearchParams(location.search), [])
  const lang = useMemo(() => queryParams.get('lang') || 'vi', [])

  const shouldRenderResult = useCallback((onSearching: boolean) => {
    return onSearching ? (
      <div className='flex w-full justify-center'>
        <CircularProgress
          classNames={{
            svg: 'h-8 w-8 text-primary-blue'
          }}
        />
      </div>
    ) : (
      <p className='text-center'>{s?.text2}</p>
    )
  }, [])

  return (
    <div className='z-20 flex max-h-[calc(100dvh-320px)] flex-col gap-2 overflow-auto rounded-xl bg-white p-4 shadow-[8px_8px_16px_0px_#0000000A]'>
      {dataJob?.length > 0
        ? dataJob?.map((item: any) => {
            return (
              <button key={item?.id} onClick={() => handleSelectItem(item)} className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='size-[48px] flex-shrink-0 rounded-full bg-neutral-50'>
                    <ImageFallback src={item?.icon?.url} alt='baove' height={200} width={200} className='size-full' />{' '}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                      <p className='text-left text-base font-bold'>{item?.name?.[lang]}</p>
                      {item?.is_added && <Chip className='h-5 bg-primary-green text-[10px] text-white *:px-0.5'>{s?.text5}</Chip>}
                    </div>
                    <div className='line-clamp-2 text-left text-xs text-primary-gray' dangerouslySetInnerHTML={{ __html: item?.description }} />
                  </div>
                </div>
              </button>
            )
          })
        : shouldRenderResult(onSearching)}
    </div>
  )
}

export default memo(SearchResult)
