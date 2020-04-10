<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    @keydown.esc="() => (isOpen = false)"
  >
    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="dtls" item-key="cdDtlId">
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>구분 목록</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" persistent max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on"
                    >신규</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.cdDtlId"
                            label="구분 식별자"
                            disabled
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.cdDtlNm"
                            label="구분 명"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"
                      >취소</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="save">저장</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.cdDtlId }}</td>
              <td>{{ item.cdDtlNm }}</td>
              <td>
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="() => (isOpen = false)"
          >닫기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  getAllDetailCode,
  createDetail,
  deleteDetail,
  updateDetail,
} from '@api/code-detail.api'

export default {
  data() {
    return {
      // 모달 오픈 여부
      isOpen: false,
      // 테이블 헤더
      headers: [
        {
          text: '식별자',
          value: 'cdDtlId',
        },
        {
          text: '구분명',
          value: 'cdDtlNm',
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      // 테이블 인덱스
      editedIndex: -1,

      // 테이블 항목
      editedItem: {
        cdDtlId: '',
        cdDtlNm: '',
      },

      // 기본 테이블 항목
      defaultItem: {
        cdDtlId: '',
        cdDtlNm: '',
      },

      // 다이얼 로그 여부
      dialog: false,

      // 수정여부
      isEdit: false,

      // 코드그룹 식별자
      CD_GRP_ID: 'D',

      // 상세코드 목록
      dtls: [],
    }
  },

  /**
   * @INFO computed 속성은 계산해야 하는 목표 데이터를 정의하는 방식으로 소프트웨어 공학에서 이야기하는 ‘선언형 프로그래밍’ 방식
   */
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '신규' : '수정'
    },
  },

  /**
   * @INFO watch 속성은 감시할 데이터를 지정하고 그 데이터가 바뀌면 이런 함수를 실행하라는 방식으로 소프트웨어 공학에서 이야기하는 ‘명령형 프로그래밍’
   */
  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  /**
   * @INFO data를 반응형으로 추적할 수 있게 되며 computed, methods, watch 등이 활성화되어 접근이 가능하게 된다. 하지만 아직까지 DOM에는 추가되지 않은 상태입니다.
   */
  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.EventBus.$on('contentL_TO_divD-1', (condition) => {
        this.isOpen = true
        this.getDtl(this.CD_GRP_ID)
      })

      this.getDtl(this.CD_GRP_ID)
    },

    /**
     * 항목을 조회한다.
     */
    getDtl(cdId) {
      getAllDetailCode(cdId).then((res) => {
        this.dtls = res.map((res) => res)
      })
    },

    /**
     * 항목수정 전 상태를 설정한다.
     *
     * @param { Object } item 선택한 로우 데이터
     */
    editItem(item) {
      this.isEdit = true
      this.editedIndex = this.dtls.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    /**
     * 항목을 삭제한다.
     *
     * @param { Object } item 선택한 로우 데이터
     */
    deleteItem(item) {
      confirm(`선택한 항목 [ ${item.cdDtlId} ] 를 삭제하시겠습니까?`) &&
        deleteDetail(this.CD_GRP_ID, item.cdDtlId).then(
          (res) => {
            this.getDtl(this.CD_GRP_ID)
          },
          (error) => {
            this.$notify({
              group: 'notifyApp',
              title: '에러!!',
              type: 'error',
              text: error,
            })
          }
        )
    },

    /**
     * 항목을 저장 혹은 수정 한다.
     */
    save() {
      if (this.isEdit) {
        updateDetail(
          this.CD_GRP_ID,
          this.dtls.find((dtl) => dtl.cdDtlSeq === this.editedItem.cdDtlSeq)
            .cdDtlId,
          this.editedItem
        ).then(
          (res) => {
            this.getDtl(this.CD_GRP_ID)
          },
          (error) => {
            this.$notify({
              group: 'notifyApp',
              title: '에러!!',
              type: 'error',
              text: error,
            })
          }
        )
      } else {
        createDetail(this.CD_GRP_ID, {
          cdDtlNm: this.editedItem.cdDtlNm,
        }).then(
          (res) => {
            this.getDtl(this.CD_GRP_ID)
          },
          (error) => {
            this.$notify({
              group: 'notifyApp',
              title: '에러!!',
              type: 'error',
              text: error,
            })
          }
        )
      }

      this.close()
    },

    /**
     * 항목을 초기화하고 다이얼로그를 닫는다.
     */
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.isEdit = false
      }, 300)
    },
  },
}
</script>
