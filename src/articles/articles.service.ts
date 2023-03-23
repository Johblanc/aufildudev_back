import { Injectable } from '@nestjs/common';
import { Article } from './entities/article.entity';
import { IsNull,In } from 'typeorm';
import { Requierment } from 'src/requierments/entities/requierment.entity';
import { User } from 'src/users/entities/user.entity';
import { Language } from 'src/languages/entities/language.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Framework } from 'src/frameworks/entities/framework.entity';
import { ArticleStatus } from './emun/articles-status.emun';

/** Les services pour la table **Articles**
 * 
 * * **create()**             : Création d'un **Article** dans la base de donnée
 * * **findAllPublic()**      : Recherche de tous les **Articles** publiques dans la base de donnée
 * * **findAllMine()**        : Recherche de tous les **Articles** d'un user dans la base de donnée
 * * **findAllSubmit()**      : Recherche de tous les **Articles** d'un user dans la base de donnée
 * * **findManyByIds()**      : Recherche par id d' **Articles** dans la base de donnée
 * * **findOneById()**        : Recherche par id d'un **Article et ses relations** dans la base de donnée
 * * **findOnePublicById()**  : Recherche par id d'un **Article et ses relations** dans la base de donnée
 * * **findOneByTitle()**     : Recherche par titre d'un **Article** dans la base de donnée
 * * **update()**             : Modification d'un **Article** dans la base de donnée 
 * * **changeStatus()**       : Modification du status d'un **Article**
 * * **remove()**             : Suppression d'un **Article** dans la base de donnée
 */
@Injectable()
export class ArticlesService {

  /**  Ensembles des relations pour la table **Articles** *(Voir constructor)* */
  allRelations : any
  constructor()
  {
    this.allRelations = {
      user : true,
      languages : true,
      categories : true,
      frameworks : true,
      comments : { user : true } ,
      needed_for : { article : true },
      requirements : { article_needed : true }
    }
  }

  /** *async* Création d'un **Article** dans la base de donnée
   * 
   * @param data  informations sur l'**Article** à créer
   * @returns     le nouvel **Article et ses relations** 
   */
  async create(
    data : {
      user : User , 
      title : string, 
      content : string, 
      requirements : Article[] ,
      languages : Language[] ,
      categories : Category[] ,
      frameworks : Framework[] ,
      status : string
    }
  ) : Promise<Article>
  {
    /** Séparation des requirements de data avec un deconstruction partielle */
    const { requirements , ...creatObject} = data ;

    /** Nouvel **Article** sans ses requirements */
    const article = await Article.create({...creatObject}).save()
    

    /** Ajout des liaisons requirements */
    await Promise.all(
      requirements.map(async item => {
        await Requierment.create({article : article, article_needed : item}).save()
      })
    )

    return (await this.findOneById(article.id))!; 
  }

  /** *async* Recherche de tous les **Articles** publiques dans la base de donnée
   * 
   * @returns tous les **Articles et leurs relations** actif
   */
  async findAllPublic() : Promise<Article[]>
  {
    return await Article.find({
      where : {
        deleted_at : IsNull(),
        status : ArticleStatus.Public
      },
      relations : this.allRelations
    });
  }

  /** *async* Recherche de tous les **Articles** d'un user dans la base de donnée
   * 
   * @returns tous les **Articles et leurs relations**  du user
   */
  async findAllMine(userId : number) : Promise<Article[]>
  {
    return await Article.find({
      where : {
        deleted_at : IsNull(),
        user : { id : userId }
      },
      relations : this.allRelations
    });
  }

  /** *async* Recherche de tous les **Articles** d'un user dans la base de donnée
   * 
   * @returns tous les **Articles et leurs relations**  du user
   */
  async findAllSubmit() : Promise<Article[]>
  {
    return await Article.find({
      where : {
        deleted_at : IsNull(),
        status : ArticleStatus.Submit
      },
      relations : this.allRelations
    });
  }

  /** *async* Recherche par id d' **Articles publiques** dans la base de donnée
   * 
   * @param ids   des **Articles** à trouver
   * @returns     la liste des **Articles**
   */
  async findManyByIds(ids: number[]) : Promise<Article[]>
  {
    return await Article.findBy({ id : In(ids), deleted_at : IsNull(), status : ArticleStatus.Public });
  }

  /** *async* Recherche par id d'un **Article et ses relations** dans la base de donnée
   * 
   * @param id      de l'**Article** à trouver
   * @returns       l'**Article et ses relations** ou null s'il n'existe pas
   */
  async findOneById(id: number)  : Promise<Article | null>
  { 
    return await Article.findOne({
      where : {
        id : id,
        deleted_at : IsNull()
      },
      relations : this.allRelations
    });
  }

  /** *async* Recherche par id d'un **Article et ses relations** dans la base de donnée
   * 
   * @param id      de l'**Article** à trouver
   * @returns       l'**Article et ses relations** ou null s'il n'existe pas
   */
  async findOnePublicById(id: number)  : Promise<Article | null>
  { 
    return await Article.findOne({
      where : {
        id : id,
        status : ArticleStatus.Public,
        deleted_at : IsNull()
      },
      relations : this.allRelations
    });
  }

  /** *async* Recherche par titre d'un **Article** dans la base de donnée
   * 
   * @param title   de l'**Article** à trouver
   * @returns       l'**Article** ou null s'il n'existe pas
   */
  async findOneByTitle(title: string)  : Promise<Article | null>
  {
    return await Article.findOneBy({title : title});
  }

  /** *async* Modification d'un **Article** dans la base de donnée 
   * 
   * @param id      de l'**Article** à modifier
   * @param data    éventuelles modifictions des propriétés de l'**Article**
   * @returns       l'**Article** modifié **et ses relations** ou null s'il n'existe pas
   */
  async update(
    id: number, 
    data : {
      title? : string, 
      content? : string, 
      requirements? : Article[] ,
      languages? : Language[] ,
      categories? : Category[] ,
      frameworks? : Framework[] ,
    },
  )  : Promise<Article | null>
  {
    /** L'**Article** à modifier */
    const article = await this.findOneById(id)

    
    console.log(article);
    
    if ( article !== null ){
      // Eventuelle modification pour tous les parametres sauf requirements
      if (data.title) article.title = data.title ;
      if (data.content) article.content = data.content ;
      if (data.languages) article.languages = data.languages ;
      if (data.categories) article.categories = data.categories ;
      if (data.frameworks) article.frameworks = data.frameworks ;
      if (article.user.access_lvl === 1 && article.status === "public") article.status = "submit"
      
      console.log(article);
      // Enregistrement des modifications
      await article.save({}) ;

      if (data.requirements){

        /** Liste des **Id** des **Articles** actuellement en requirements */
        const curRequireIds = article.requirements.map(item => item.asRequirement().id)
        
        /** Liste des **Id** des **Articles** nouvellement en requirements */
        const newRequireIds = data.requirements.map(item => item.id)
        
        /** Liste des **Articles** manquants */
        const requireAdd = data.requirements
        .filter(
          item => 
          !curRequireIds.includes(item.id)
        )

        /** Liste des **Articles** surnuméraires */
        const requireDel = article.requirements
          .filter(
            item => 
            !newRequireIds.includes(item.asRequirement().id)
          )

          
        // Mise à jour des requirements manquants
        await Promise.all(
          requireAdd.map(async item => {
            await Requierment.create({article : article, article_needed : item}).save()
          })
        )
          
        // Mise à jour des requirements surnuméraires
        await Promise.all(
          requireDel.map(async item => {await item.remove()})
        )
        
      }
      return await this.findOneById(article.id);
    }
    return null;
  }

  /** *async* Modification du status d'un **Article**
   * 
   * @param id de l'**Article** à modifier
   * @param status le nouveau status
   * @returns l'**Article** à modifié
   */
  async changeStatus(id : number , status : ArticleStatus){
    const article = await this.findOneById(id)
    if (article !== null ){
      article.status = status ;
      await article.save()
    }
    return article ;
  }


  /** *async* Suppression d'un **Article** dans la base de donnée 
   * 
   * @param id  de l'**Article** à supprimer
   * @returns l'**Article** supprimé **et ses relations** ou null s'il n'existe pas
   */
  async remove(id: number) : Promise<Article | null>
  {
    
    const article = await this.findOneById(id)
    if (article !== null)  
    {
      Promise.all([
        ...article.requirements.map(async item => await item.remove()),
        ...article.needed_for.map(async item => await item.remove())
      ])
      await article.remove() ;
    };
    return article
  }
}
