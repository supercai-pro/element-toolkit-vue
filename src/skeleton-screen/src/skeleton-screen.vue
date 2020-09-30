<template>
  <div class="">
      <slot v-if="!loading"></slot>
      <!--段落-->
      <div v-if="loading && type === 'simpleParagraph'" class="paragraph-body" v-for="item in list" :key="item.id">
          <div class="simple-paragraph">
              <div class="loading-list screen-list-one"></div>
              <div class="loading-list"></div>
              <div class="loading-list"></div>
              <div class="loading-list screen-list-last"></div>
          </div>
      </div>
      <div v-if="loading && type === 'simpleImgParagraph'" class="paragraph-body" v-for="item in list" :key="item.id">
          <div class="section-pic">
              <div class="loading-paragraph-img"></div>
          </div>
          <div class="simple-img-paragraph">
              <div class="loading-list screen-list-one"></div>
              <div class="loading-list"></div>
              <div class="loading-list"></div>
              <div class="loading-list screen-list-last"></div>
          </div>
      </div>
      <div v-if="loading && type === 'complexParagraph'" class="paragraph-body-completed" v-for="item in list" :key="item.id">
          <div class="section-pic-completed">
              <div class="loading-paragraph-bigimg"></div>
          </div>
          <div class="complex-paragraph">
              <div class="loading-list screen-list-one"></div>
              <div class="loading-list"></div>
              <div class="loading-list"></div>
              <div class="loading-list screen-list-info"></div>
              <div class="loading-list screen-list-last"></div>
          </div>
      </div>
      <!--卡片-->
      <div v-if="loading && type === 'simpleBlockCard'" class="card-block-body" v-for="item in list" :key="item.id">
          <div class="section-pic">
              <div class="loading-card-img"></div>
          </div>
          <div class="simple-blockCard">
              <div class="loading-list card-list-first"></div>
              <div class="loading-list"></div>
              <div class="loading-list card-list-last"></div>
          </div>
      </div>
      <div v-if="loading && type === 'tagBlockCard'" class="card-block-body" v-for="item in list" :key="item.id">
          <div class="section-pic">
              <div class="loading-card-img"></div>
          </div>
          <div class="tag-block-card">
              <div class="loading-list card-list-first"></div>
              <div class="loading-list"></div>
              <div class="loading-list card-list-last"></div>
          </div>
      </div>
      <div v-if="loading && type === 'operateBlockCard'" class="card-block-body" v-for="item in list" :key="item.id">
          <div class="section-pic">
              <div class="loading-card-img"></div>
          </div>
          <div class="oprate-block-card">
              <div class="loading-list card-list-first"></div>
              <div class="loading-list"></div>
              <div class="loading-list card-list-last"></div>
          </div>
      </div>
      <div v-if="loading && type === 'simpleCompletedCard'" class="card-body" v-for="item in list" :key="item.id">
          <div class="section-pic-completed">
              <div class="loading-table-img"></div>
          </div>
          <div class="section-content-completed">
              <div class="loading-list"></div>
              <div class="loading-list"></div>
              <div class="loading-list card-list-last"></div>
          </div>
      </div>
      <div v-if="loading && type === 'tagCompletedCard'" class="card-body" v-for="item in list" :key="item.id">
          <div class="section-pic-completed">
              <div class="loading-table-img"></div>
          </div>
          <div class="tag-completed-card">
              <div class="loading-list"></div>
              <div class="loading-list"></div>
              <div class="loading-list card-list-info"></div>
              <div class="loading-list card-list-last"></div>
          </div>
      </div>
      <div v-if="loading && type === 'operateCompletedCard'" class="card-body" v-for="item in list" :key="item.id">
          <div class="section-pic-completed">
              <div class="loading-table-img"></div>
          </div>
          <div class="oprate-completed-card">
              <div class="loading-list"></div>
              <div class="loading-list"></div>
              <div class="loading-list card-list-info"></div>
              <div class="loading-list card-list-last"></div>
          </div>
      </div>
      <!--表格-->
      <div v-if="loading && type === 'simpleTable'" class="table-body">
          <div class="simple-table" v-for="item in list" :key="item.id">
              <div>
                  <p class="loading-list"></p>
              </div>
          </div>
          <div class="pt10">
              <a class="text-btn loading-list" href="javascript:;">更多</a>
          </div>
      </div>
      <div v-if="loading && type === 'simpleSupTable'" class="table-body">
          <div class="simple-sup-table" v-for="item in list" :key="item.id">
              <div>
                  <p class="loading-list"></p>
                  <div class="loading-list"></div>
              </div>
          </div>
          <div class="pt10">
              <a class="loading-list" href="javascript:;">更多</a>
          </div>
      </div>
      <div v-if="loading && type === 'horizontalSupTable'" class="table-body">
          <div class="horizontal-sup-table" v-for="item in list" :key="item.id">
              <div class="horizontal-list">
                  <p class="loading-list-left"></p>
                  <div class="loading-list-right"></div>
              </div>
          </div>
          <div class="pt10">
              <a class="text-btn loading-list" href="javascript:;">更多</a>
          </div>
      </div>
      <div v-if="loading && type === 'complexImgTable'" class="img-table-body" v-for="item in list" :key="item.id">
          <div class="section-pic-completed">
              <div class="loading-table-img"></div>
          </div>
          <div class="complex-img-list">
              <div class="loading-list"></div>
              <div class="loading-list"></div>
              <div class="loading-list screen-list-last"></div>
          </div>
      </div>
      <div v-if="loading && type === 'complexTable'" class="complex-table" v-for="item in list" :key="item.id">
          <div class="loading-list-left complex-table-one"></div>
          <div class="loading-list-left complex-table-two"></div>
          <div class="loading-list-left complex-table-three"></div>
          <div class="loading-list complex-table-four"></div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'skeleton-screen',
  props: {
    type: {
      type: String
    },
    loading: {
      type: Boolean
    },
    list: {
      type: Array
    }
  },
  methods: {}
}
</script>

<style>

</style>
