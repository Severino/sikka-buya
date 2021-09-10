export class TypeQueries {

  static add() {
    return `
        mutation ($projectId:String,
            $treadwellId:String,
            $mint:ID,
            $mintAsOnCoin:String,
            $material:ID,
            $nominal:ID,
            $yearOfMint:String,
            $donativ:Boolean,
            $procedure:String,
            $issuers:[TitledPersonInput],
            $otherPersons:[ID],
            $overlords:[OverlordInput],
            $caliph:ID,
            $avers:CoinSideInformationInput,
            $reverse:CoinSideInformationInput,
            $cursiveScript:Boolean,
            $coinMarks:[ID],
            $literature:String,
            $pieces:[String],
            $specials:String,
            $excludeFromTypeCatalogue: Boolean
            $excludeFromMapApp: Boolean,
            $internalNotes: String,
            $yearUncertain:Boolean,
            $mintUncertain:Boolean
            ){
        addCoinType(data: {
            projectId: $projectId,
            treadwellId: $treadwellId,
            mint: $mint,
            mintAsOnCoin: $mintAsOnCoin,
            material: $material,
            nominal: $nominal,
            yearOfMint: $yearOfMint,
            donativ: $donativ,
            procedure: $procedure,
            issuers: $issuers,
            otherPersons: $otherPersons,
            overlords: $overlords,
            caliph: $caliph,
            avers: $avers,
            reverse: $reverse,
            cursiveScript: $cursiveScript,
            coinMarks: $coinMarks,
            literature: $literature,
            pieces: $pieces,
            specials: $specials,
            excludeFromTypeCatalogue:$excludeFromTypeCatalogue,
            excludeFromMapApp:$excludeFromMapApp,
            internalNotes:$internalNotes,
            yearUncertain: $yearUncertain,
            mintUncertain: $mintUncertain
         })
         }
   `;
  }

  static update() {
    return `
        mutation (
          $id:ID,
          $projectId:String,
          $treadwellId:String,
          $mint:ID,
          $mintAsOnCoin:String,
          $material:ID,
          $nominal:ID,
          $yearOfMint:String,
          $donativ:Boolean,
          $procedure:String,
          $issuers:[TitledPersonInput],
          $otherPersons:[ID],
          $overlords:[OverlordInput],
          $caliph:ID,
          $avers:CoinSideInformationInput,
          $reverse:CoinSideInformationInput,
          $cursiveScript:Boolean,
          $coinMarks:[ID],
          $literature:String,
          $pieces:[String],
          $specials:String,
          $excludeFromTypeCatalogue:Boolean,
          $excludeFromMapApp:Boolean
          $internalNotes: String,
          $yearUncertain:Boolean,
          $mintUncertain:Boolean
        ){
        updateCoinType(id: $id, data: {
            projectId: $projectId,
            treadwellId: $treadwellId,
            mint: $mint,
            mintAsOnCoin: $mintAsOnCoin,
            material: $material,
            nominal: $nominal,
            yearOfMint: $yearOfMint,
            donativ: $donativ,
            procedure: $procedure,
            issuers: $issuers,
            otherPersons: $otherPersons,
            overlords: $overlords,
            caliph: $caliph,
            avers: $avers,
            reverse: $reverse,
            cursiveScript: $cursiveScript,
            coinMarks: $coinMarks,
            literature: $literature,
            pieces: $pieces,
            specials: $specials,
            excludeFromTypeCatalogue: $excludeFromTypeCatalogue,
            excludeFromMapApp: $excludeFromMapApp
            internalNotes: $internalNotes,
            yearUncertain: $yearUncertain,
            mintUncertain: $mintUncertain
         })
         }
   `
  }

  static get(id) {
    {
      return `{
              getCoinType(id:${id}){
                id
                projectId
                treadwellId
                mint {
                  id,
                  name
                }
                mintAsOnCoin
                material {
                  id,
                  name
                }
                nominal {
                  id,
                  name
                }
                yearOfMint
                donativ
                procedure
                issuers {
                  id,
                  name,
                    role {
                      id, name
                    }
                  titles {
                    id,
                    name
                  }
                  honorifics{
                    id,
                    name}
                }
                overlords {
                  id
                  rank
                    name,
                    role {
                      id, name
                    }
                  titles {
                    id,
                    name
                  }
                  honorifics{
                    id,
                    name}
                }
                otherPersons {
                  id
                  name
                  role {
                    id, name
                  }
                }
                caliph {
                  id
                  name
                  role {
                    id, name
                  }
                }
                avers {
                  fieldText
                  innerInscript
                  intermediateInscript
                  outerInscript
                  misc
                }
                reverse {
                  fieldText
                  innerInscript
                  intermediateInscript
                  outerInscript
                  misc
                }
                cursiveScript
                coinMarks {
                  id
                  name
                }
                literature
                pieces
                specials
                excludeFromTypeCatalogue
                excludeFromMapApp
                internalNotes
                mintUncertain
                yearUncertain
        }
      }`
    }
  }
}