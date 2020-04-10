<template>
  <!-- 컨텐츠 영역 -->
  <v-dialog v-model="isOpen" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">사용자 등록</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="이름을 입력하세요.*" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                :items="[
                  '관리자',
                  '간호사',
                  '운영팀',
                  '지원팀',
                  '원무팀',
                  '의사',
                ]"
                label="구분을 선택하세요.*"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="아이디를 입력하세요.*"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                :items="[
                  '전체',
                  '사용자관리',
                  '대기관리',
                  '이력관리',
                  '대기, 이력',
                  '대기, 사용자',
                ]"
                label="권한을 선택하세요.*"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="비밀번호를 입력하세요."
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                :items="['사용', '정지']"
                label="상태를 선택하세요.*"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="비밀번호를 재입력하세요.*"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6"> </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="휴대번호를 입력하세요.*"
                hide-details
                single-line
                type="number"
                required
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Legal middle name"
                  hint="example of helper text only on focus"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col> -->
            <!-- <v-col cols="12" sm="6">
                <v-autocomplete
                  :items="[
                    'Skiing',
                    'Ice hockey',
                    'Soccer',
                    'Basketball',
                    'Hockey',
                    'Reading',
                    'Writing',
                    'Coding',
                    'Basejump',
                  ]"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-col> -->
          </v-row>
        </v-container>
        <!-- <small>*indicates required field</small> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="() => this.$emit('listenerModalData', false)"
          >닫기</v-btn
        >
        <v-btn
          color="blue darken-1"
          text
          @click="() => this.$emit('listenerModalData', false)"
          >저장</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
  },
  methods: {},
}
</script>
