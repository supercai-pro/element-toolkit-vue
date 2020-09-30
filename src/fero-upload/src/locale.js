import { t } from './locales'

export default {
  methods: {
    t (...args) {
      return t.apply(this, args)
    }
  }
}
