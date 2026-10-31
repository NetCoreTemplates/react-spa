import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { cleanup, render, screen } from '@testing-library/react'
import { ClientContext } from '@servicestack/react'
import { ApiResult, JsonServiceClient } from '@servicestack/client'
import { HelloResponse } from '@/lib/dtos'
import HelloApi from './HelloApi'

afterEach(cleanup)

describe('HelloApi', () => {
    it('renders the API response', async () => {
        const client = new JsonServiceClient()
        const api = vi.spyOn(client, 'api').mockResolvedValue(new ApiResult({ response: new HelloResponse({ result: 'Hello, Vite+!' }) }))

        render(
            <ClientContext.Provider value={client}>
                <HelloApi value="Vite+" />
            </ClientContext.Provider>,
        )

        expect(await screen.findByText('Hello, Vite+!')).toBeTruthy()
        expect(api).toHaveBeenCalledOnce()
    })
})
