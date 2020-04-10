<template>
  <v-card class="mt-5">
    <v-card-title class="elevation-1">
      사용자 목록
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>

      <div class="mr-2 ml-12">
        <v-btn
          small
          color="secondary"
          @click="() => EventBus.$emit('contentL_TO_divD-1')"
          >구분등록</v-btn
        >
      </div>
      <div class="mr-2">
        <v-btn small color="success" @click="dialog = true">사용자 등록</v-btn>
      </div>
    </v-card-title>

    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="users"
      :items-per-page="15"
      :footer-props="{
        showFirstLastPage: true,
        itemsPerPageText: '',
        itemsPerPageAllText: '전체',
      }"
    >
      <template v-slot:top>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-card>
            <v-card-text>
              <v-card-title>
                사용자 등록
              </v-card-title>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="editedItem.userDiv"
                      :items="dtls"
                      label="구분을 선택하세요.*"
                      item-value="cdDtlId"
                      item-text="cdDtlNm"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.userId"
                      label="아이디를 입력하세요.*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.userNm"
                      label="이름을 입력하세요.*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      v-model="editedItem.roleIds"
                      :items="roles"
                      label="권한을 선택하세요.*"
                      item-value="roleId"
                      item-text="roleNm"
                      attach
                      chips
                      multiple
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.userPwd"
                      label="비밀번호를 입력하세요."
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      required
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.userRePwd"
                      label="비밀번호를 재입력하세요.*"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show2 ? 'text' : 'password'"
                      name="input-10-1"
                      required
                      @click:append="show2 = !show2"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="editedItem.userUseYn"
                      :items="[
                        { text: '사용', value: 'Y' },
                        { text: '정지', value: 'N' },
                      ]"
                      label="상태를 선택하세요.*"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.userPhone"
                      label="휴대번호를 입력하세요.*"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">취소</v-btn>
              <v-btn color="blue darken-1" text @click="save">저장</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.userId }}</td>
          <td>{{ item.userNm }}</td>
          <td>{{ getCdDtlNm(item) }}</td>
          <td>{{ item.userPwd }}</td>
          <td>{{ item.userPhone }}</td>
          <td>{{
            item.roles.length === 0
              ? '-'
              : item.roles.map((role) => role.roleNm).join(',')
          }}</td>
          <td>{{ item.userUseYn === 'Y' ? '사용' : '정지' }}</td>
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
  </v-card>
</template>

<script>
import { userComputed, userMethods } from '@state/helpers'
import { createUser, deleteUser, updateUser } from '@api/users.api'
import { getAllRoles } from '@api/role.api'
import { getAllDetailCode } from '@api/code-detail.api'

export default {
  props: {
    isDivModal: Boolean,
    isDeptModal: Boolean,
    isUserModal: Boolean,
  },
  data() {
    return {
      // 비밀번호
      show1: false,

      // 비밀번호 재확인
      show2: false,

      // 테이블 헤더
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'userId',
        },
        { text: '성명', value: 'userNm' },
        { text: '구분', value: 'userDiv' },
        { text: '비밀번호', value: 'userPwd' },
        { text: '연락처', value: 'userPhone' },
        { text: '권한', value: 'roles' },
        { text: '상태', value: 'userUseYn' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      // 테이블 인덱스
      editedIndex: -1,

      // 테이블 항목
      editedItem: {
        userId: '',
        userNm: '',
        userDiv: '',
        userPwd: '',
        userPhone: '',
        roleIds: '',
        userUseYn: 'Y',
      },

      // 기본 테이블 항목
      defaultItem: {
        userId: '',
        userNm: '',
        userDiv: '',
        userPwd: '',
        userPhone: '',
        roleIds: '',
        userUseYn: 'Y',
      },

      // 다이얼 로그 여부
      dialog: false,

      // 수정여부
      isEdit: false,

      // 상세코드 목록
      dtls: [],

      // 권한 목록
      roles: [],
    }
  },

  /**
   * @INFO computed 속성은 계산해야 하는 목표 데이터를 정의하는 방식으로 소프트웨어 공학에서 이야기하는 ‘선언형 프로그래밍’ 방식
   */
  computed: {
    ...userComputed,
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

  created: function() {
    this.initiazlize()
  },

  /**
   * @INFO data를 반응형으로 추적할 수 있게 되며 computed, methods, watch 등이 활성화되어 접근이 가능하게 된다. 하지만 아직까지 DOM에는 추가되지 않은 상태입니다.
   */
  methods: {
    // 사용자 메서드
    ...userMethods,
    getCdDtlNm(user) {
      const dtl = this.dtls.find((dtl) => dtl.cdDtlId === user.userDiv)
      return dtl === undefined ? '-' : dtl.cdDtlNm
    },
    initiazlize() {
      this.getCondition()
    },

    /**
     * 사용자를 조회한다.
     */
    getItem() {
      this.fetchUsers()
    },

    /**
     * 항목을 조회한다.
     */
    getCondition() {
      getAllDetailCode('M').then(
        (res) => {
          this.dtls = res.map((res) => res)
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
      getAllRoles().then(
        (res) => {
          this.roles = res.map((res) => res)
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
     * 항목수정 전 상태를 설정한다.
     *
     * @param { Object } item 선택한 로우 데이터
     */
    editItem(item) {
      this.isEdit = true
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.roleIds = item.roles.map((role) => role.roleId)
      this.dialog = true
    },

    /**
     * 항목을 삭제한다.
     *
     * @param { Object } item 선택한 로우 데이터
     */
    deleteItem(item) {
      confirm(`선택한 항목 [ ${item.userId} ] 를 삭제하시겠습니까?`) &&
        deleteUser(item.userId).then((res) => {
          this.getItem()
        })
    },

    /**
     * 항목을 저장 혹은 수정 한다.
     */
    save() {
      if (
        !this.isEdit &&
        this.editedItem.userPwd !== this.editedItem.userRePwd
      ) {
        alert('비밀번호가 일치하지 않습니다.')
        return false
      }

      if (
        this.isEdit &&
        this.editedItem.userPwd !==
          this.users.find((user) => user.userSeq === this.editedItem.userSeq)
            .userPwd
      ) {
        if (this.editedItem.userPwd !== this.editedItem.userRePwd) {
          alert('비밀번호가 일치하지 않습니다.')
          return false
        }
      }

      if (this.isEdit) {
        updateUser(
          this.users.find((user) => user.userSeq === this.editedItem.userSeq)
            .userId,
          this.editedItem
        ).then(
          (res) => {
            this.getItem()
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
        createUser(this.editedItem).then(
          (res) => {
            this.getItem()
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
