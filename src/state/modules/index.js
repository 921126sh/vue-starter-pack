
/**
 * ***************************************************************
 *
 *
 * 1. store파일에 있는 모든 모듈을 vuex에 등록한다.
 * 2. 디렉토리 계층 구조와 모든 namespace를 동일한 형식으로 변환한다.(camelCase)
 *
 *
 * ***************************************************************
 */


import camelCase from 'lodash/camelCase'

const modulesCache = {}
const storeData = { modules: {} }

;(function updateModules() {
  const requireModule = require.context(
    // 현재 디렉토리를 탐색한다.
    '.',
    // 하위 디렉토리 탐색 여부
    true,
    // 현재 파일, unit 파일이 아닌 파일을 탐색한다.
    /^((?!index|\.unit\.).)*\.js$/
  )

  // 모든 vuex모듈을 등록한다.
  requireModule.keys().forEach((fileName) => {
    const moduleDefinition =
      requireModule(fileName).default || requireModule(fileName)

    // hot reloading중 모듈이 캐시한 모듈과 같다면...
    if (modulesCache[fileName] === moduleDefinition) return

    // 효율적인 hot reloading을 위해 캐시를 업데이트한다.
    modulesCache[fileName] = moduleDefinition

    // 모듈 path를 구한다.
    const modulePath = fileName
      // ./ 를 제거한다.
      .replace(/^\.\//, '')
      // 파일확장자를 제거한다.
      .replace(/\.\w+$/, '')
      // 중첩된 모듈을 배열 경로로 분활한다.
      .split(/\//)
      // 모든 모듈을 camel케이스로 등록한다.
      .map(camelCase)

    // 현재 경로에대한 모듈 객체를 가져온다.
    const { modules } = getNamespace(storeData, modulePath)

    // 모듈을 모듈 객체에 추가한다.
    modules[modulePath.pop()] = {
      // 모듈의 기본 네임스페이스 여부
      namespaced: true,
      ...moduleDefinition,
    }
  })

  // hot reloading 환경이라면...
  if (module.hot) {
    // 매 번 vuex모듈을 업데이트 한다.
    module.hot.accept(requireModule.id, () => {
      updateModules()
      require('../store').default.hotUpdate({ modules: storeData.modules })
    })
  }
})()

// 모든 모듈을 찾을 수 있도록 리커시브 한다.
function getNamespace(subtree, path) {
  if (path.length === 1) return subtree

  const namespace = path.shift()
  subtree.modules[namespace] = {
    modules: {},
    namespaced: true,
    ...subtree.modules[namespace],
  }
  return getNamespace(subtree.modules[namespace], path)
}

export default storeData.modules
