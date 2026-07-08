import { expect, fixture, html } from '@open-wc/testing'
import './my-element'
import type { MyElement } from './my-element'

describe('my-element', () => {
  it('renders with default values', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`)
    expect(el.count).to.equal(0)
    
    const button = el.shadowRoot!.querySelector('button')
    expect(button?.textContent).to.include('Count is 0')
  })

  it('increments count on button click', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`)
    const button = el.shadowRoot!.querySelector('button')
    
    button?.click()
    await el.updateComplete
    
    expect(el.count).to.equal(1)
    expect(button?.textContent).to.include('Count is 1')
  })

  it('passes the a11y audit', async () => {
    const el = await fixture<MyElement>(html`<my-element></my-element>`)
    await expect(el).shadowDom.to.be.accessible()
  })
})
