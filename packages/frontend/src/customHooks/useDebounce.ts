import { useCallback, useState } from 'react'
import _ from 'lodash'

export const useDebounce = (obj: any = null, wait: number = 1000) => {
    const [state, setState] = useState(obj)

    const setDebouncedState = (_val: any) => {
        debounce(_val)
    }

    const debounce = useCallback(
        (_prop) =>
            _.debounce((_prop: string) => {
                setState(_prop)
            }, wait),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return [state, setDebouncedState]
}
